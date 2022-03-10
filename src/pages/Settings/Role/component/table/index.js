import {
  CheckCircleFilled,
  CloseCircleFilled,
  EllipsisOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { message, Modal, Pagination, Popover, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { settingUserApi } from '../../../../../api/settingUserApi';
import { PAGE_SIZE_OPTIONS } from '../../../../../constants';
import { ROLE_URL } from '../../../../../constants/api';
import { messageAction } from '../../../User/userBody/constant';
import TableButton from '../../../User/userBody/userTable/tableButton';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { Excel } from 'antd-table-saveas-excel';
import edit from '../../../../../assets/images/tableIcon/edit.svg';
import del from '../../../../../assets/images/tableIcon/del.svg';
import { setReloadTable } from '../../../commonSlice/userSlice';
import { useDispatch, useSelector } from 'react-redux';

/**
 * @author
 * @function TableRole
 **/

export const TableRole = props => {
  const handleFullscreen = useFullScreenHandle();

  const {
    filter,
    keyword,
    setIsEdit,
    setCheckList,
    form,
    setVisibleDrawerAddRole,
  } = props;
  const dispatch = useDispatch();
  const { reloadTable } = useSelector(state => state.user);
  const { t } = useTranslation();
  const DEFAULT_COLUMN = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      sorter: true,
      showSorterTooltip: {
        title: t('language.titleChangeSorter'),
      },
      show: true,
      export: true,
      align: 'center',
    },
    {
      title: t('role.roleTitle'),
      dataIndex: 'title',
      key: 'title',
      width: '20%',
      sorter: true,
      show: true,
      export: true,
      showSorterTooltip: {
        title: t('language.titleChangeSorter'),
      },
      render: roleTitle => {
        return <div className="text-truncate">{roleTitle}</div>;
      },
    },
    {
      title: t('role.permission'),
      dataIndex: 'permission',
      key: 'permission',
      sorter: true,
      show: true,
      showSorterTooltip: {
        title: t('language.titleChangeSorter'),
      },
      export: true,
      render: permission => {
        let obj = JSON.parse(permission);
        let roleArrStr = [];
        for (let x in obj) {
          let roleArr = [];
          if (obj[x].edit && obj[x].view && obj[x].add && obj[x].delete) {
            roleArrStr.push(t(`role.${x}`));
          } else {
            for (let i in obj[x]) {
              roleArr.push(t(`role.${i}`));
            }
            roleArrStr.push(`${t(`role.${x}`)}(${roleArr.join(', ')})`);
          }
        }
        return <div className="text-truncate">{roleArrStr.join(', ')}</div>;
      },
    },
    {
      title: t('user.statusLabelModal'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '10%',
      render: status => {
        if (status) {
          return <CheckCircleFilled className="check-icon" />;
        } else {
          return <CloseCircleFilled className="close-icon" />;
        }
      },
      show: true,
      export: true,
    },
    {
      title: 'Action',
      align: 'center',
      key: 'action',
      width: '5%',
      show: true,
      render: (text, record) => {
        return (
          <Popover
            zIndex={10}
            content={
              <Content
                record={record}
                t={t}
                handleOpenDrawerEdit={handleOpenDrawerEdit}
                onDeleteRole={onDeleteRole}
              />
            }
            trigger="hover"
            placement="bottom"
          >
            <EllipsisOutlined
              style={{
                fontSize: '25px',
                cursor: 'pointer',
                color: 'rgba(0, 0, 0, 0,5)',
              }}
            />
          </Popover>
        );
      },
    },
  ];
  const [columns, setColumns] = useState(DEFAULT_COLUMN);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [sorter, setSorter] = useState('');
  //func
  const onTableChange = (col, filter, sorter) => {
    if (sorter.order === 'ascend') {
      setSorter(sorter.field + '-ASC');
    } else if (sorter.order === 'descend') {
      setSorter(sorter.field + '-DESC');
    } else {
      setSorter('');
    }
  };
  const parseCheckList = record => {
    let arr = [];
    for (let i in record) {
      for (let e in record[i]) {
        arr.push(`${i}.${e}`);
      }
    }
    setCheckList(arr);
  };
  const handleOpenDrawerEdit = record => {
    setIsEdit(true);
    setVisibleDrawerAddRole(true);
    parseCheckList(JSON.parse(record.permission));
    form.setFieldsValue({
      title: record.title,
      status: record.status,
      id: record.id,
    });
  };
  //fetch Api
  const onDeleteRole = async val => {
    try {
      await settingUserApi.deleteData(ROLE_URL, val.id);
      message.success(t('role.delSuccess'));
      dispatch(setReloadTable());
    } catch (err) {
      message.error(err.message);
    }
  };
  const handleExport = async () => {
    try {
      const excel = new Excel();
      const res = await settingUserApi.getAll(ROLE_URL, {
        limit: total,
        page: 1,
        orderby: sorter,
      });
      if (res.data.status === 'success') {
        const fillCol = columns.filter(e => e.export && e.show);
        excel
          .addSheet('Role')
          .addColumns(
            fillCol.map(e => {
              if (e.dataIndex === 'status') {
                e.render = status =>
                  status ? t('user.access') : t('user.lock');
              }
              return e;
            }),
          )
          .addDataSource(res.data.data)
          .saveAs('Roles.xlsx');
      }
    } catch (e) {
      message.error(e.message);
    }
  };
  const fetchRoleApi = async () => {
    try {
      const res = await settingUserApi.getAll(ROLE_URL, {
        limit: pageSize,
        page: current,
        permission: filter,
        key: keyword,
        orderby: sorter,
      });
      if (res.data.status === 'success') {
        setLoading(false);
        setDataTable(res.data.data);
        setTotal(res.data.total);
      } else {
        setLoading(false);
      }
    } catch (e) {
      message.error(e.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchRoleApi();
  }, [current, pageSize, filter, keyword, sorter, reloadTable]);
  const onPageChange = (page, pageSize) => {
    setCurrent(page);
    setPageSize(pageSize);
  };
  return (
    <>
      <FullScreen handle={handleFullscreen} className="fullscreen-table">
        <div className="table-container">
          <TableButton
            columns={columns}
            setColumns={setColumns}
            total={10}
            handleFullscreen={handleFullscreen}
            handleExport={handleExport}
          />
          <Table
            columns={columns.filter(e => e.show)}
            rowKey="id"
            size="small"
            scroll={{ x: 900 }}
            pagination={false}
            loading={loading}
            dataSource={dataTable}
            onChange={onTableChange}
          />
          <Pagination
            className="pagination"
            total={total}
            pageSize={pageSize}
            onChange={onPageChange}
            showQuickJumper={true}
            size="default"
            current={current}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            showSizeChanger={true}
          />
        </div>
      </FullScreen>
    </>
  );
};
function confirm(config) {
  Modal.confirm(config);
}
const Content = props => (
  <div className="user__action">
    <span
      className="pointer btn"
      onClick={() => {
        props.handleOpenDrawerEdit(props.record);
      }}
    >
      <img src={edit} alt="icon" className="pr-10" />
      {props.t(`user.${messageAction.edit}`)}
    </span>

    <span
      className="pointer btn"
      onClick={() => {
        confirm({
          title: props.t('user.confirmMessage'),
          icon: <ExclamationCircleOutlined />,
          content: props.record.title,
          okText: props.t('user.yes'),
          cancelText: props.t('user.no'),
          onOk: () => {
            props.onDeleteRole(props.record);
          },
        });
      }}
    >
      <img src={del} alt="icon" className="pr-10" />
      {props.t(`user.${messageAction.delete}`)}
    </span>
  </div>
);
