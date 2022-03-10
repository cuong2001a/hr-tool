import {
  CheckCircleFilled,
  CloseCircleFilled,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Button, message, Modal, Popover, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { positionApi } from '../../../../api/positionApi';
import { CONFIG_PAGINATION } from '../../../../constants';
import { convertArrayToParamsWithDash } from '../../../../utils/convertArrayToParamsWithDash';
import removeIcon from '../../../../assets/images/request/DeleteOutlined.svg';
import editIcon from '../../../../assets/images/request/Edit.svg';
import {
  getAllPosition,
  getDetailPosition,
  setReloadTalbe,
  setTotalPosition,
  showFormPosition,
} from '../reducer';
import TableButton from './TableButton';
function PositionTable(props) {
  const {
    listParams,
    onChangeListParams,
    setFormBtnTitle,
    setFormTitle,
    setIsEdit,
  } = props;
  const { limit } = listParams;
  const { dataPosition, totalPosition } = useSelector(item => item.position);
  const { t } = useTranslation();
  const { reloadTable } = useSelector(item => item.position);
  const data = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      hide: true,
      export: true,
      width: '10%',
      defaultSortOrder: 'ascend',
      showSorterTooltip: {
        title: t('position.idTooltip'),
      },
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t('position.department'),
      dataIndex: 'parent_title',
      key: 'parent_title',
      hide: true,
      export: true,
      width: '10%',
      showSorterTooltip: {
        title: t('position.departmentTooltip'),
      },
      sorter: (a, b) => a.parent_title < b.parent_title,
    },
    {
      title: t('position.title'),
      dataIndex: 'title',
      key: 'title',
      width: '10%',
      hide: true,
      export: true,
      showSorterTooltip: {
        title: t('position.titleTooltip'),
      },
      sorter: (a, b) => a.title < b.title,
      render: title => {
        return <p className="position__table-title">{title} </p>;
      },
    },
    {
      title: t('position.description'),
      dataIndex: 'description',
      key: 'description',
      hide: true,
      export: true,
      width: '25%',
      showSorterTooltip: {
        title: t('position.descriptionTooltip'),
      },
      sorter: (a, b) => a.description < b.description,
      render: description => {
        return <p className="position__table-description">{description} </p>;
      },
    },
    {
      title: t('position.manager'),
      dataIndex: 'manager_id',
      key: 'manager_id',
      hide: true,
      export: true,
      width: '12%',
      showSorterTooltip: {
        title: t('position.managerTooltip'),
      },
      sorter: (a, b) => a.manager_id < b.manager_id,
    },
    {
      title: t('position.requestor'),
      dataIndex: 'requestor',
      key: 'requestor',
      hide: true,
      export: true,
      width: '20%',

      render: requestor => <div>{JSON.parse(requestor)?.join(',')}</div>,
    },
    {
      title: t('position.status'),
      dataIndex: 'status',
      align: 'center',
      key: 'status',
      width: '6.5%',
      hide: true,

      export: true,
      render: status => {
        if (status === 1) {
          return (
            <CheckCircleFilled
              style={{
                color: '#78BE20',
                fontSize: 20,
              }}
            />
          );
        } else {
          return (
            <CloseCircleFilled
              style={{
                color: '#F94144',
                fontSize: 20,
              }}
            />
          );
        }
      },
    },
    {
      title: t('position.action'),
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      width: '6.5%',
      hide: true,

      render: (text, record) => {
        return (
          <Popover
            style={{ padding: 0 }}
            content={<Actions record={record} />}
            placement="bottom"
            trigger="hover"
          >
            <EllipsisOutlined
              style={{
                fontSize: '25px',
                width: '27px',
                height: '32px',
                fontWeight: 400,
              }}
            />
          </Popover>
        );
      },
    },
  ];
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState(data);
  const [selectedRowKeys, setSelectedRowkeys] = useState([]);
  const dispatch = useDispatch();
  const handleFullScreen = useFullScreenHandle();
  const onSelectChange = selectedRowKeys => {
    console.log('selected', selectedRowKeys);
    setSelectedRowkeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const showForm = () => {
    dispatch(showFormPosition(true));
  };
  const onChange = pagination => {
    const params = {
      limit: pagination.pageSize,
      page: pagination.current,
      orderby: 'id-DESC',
    };
    console.log(params);
    onChangeListParams(prev => ({ ...prev, ...params }));
    dispatch(setReloadTalbe());
  };
  const Actions = ({ record }) => (
    <div className="position__action" style={{}}>
      <Button
        className="position__action--edit"
        icon={<img src={editIcon} alt="detail" />}
        size="large"
        onClick={e => getIdPosition(e, record)}
      >
        {t('position.edit')}
      </Button>
      <Button
        className="position__action--delete"
        icon={<img src={removeIcon} alt="detail" />}
        size="large"
        onClick={e => handleRemovePosition(e, record)}
      >
        {t('position.delete')}
      </Button>
    </div>
  );
  const handleRemovePosition = async (e, record) => {
    try {
      Modal.confirm({
        title: t('position.questionRemove'),
        icon: <ExclamationCircleOutlined />,
        centered: false,
        content: `${record.title}`,
        onOk() {
          handleConfirmOk(record.id);
        },
        okType: 'danger',
        okText: t('position.yes'),
        cancelText: t('position.no'),
        width: 450,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getIdPosition = async (e, record) => {
    const { data } = await positionApi.getPositionById(record.id);
    const covertArr = JSON.parse(data.data.requestor);
    const a = {
      ...data.data,
      requestor: covertArr,
    };
    dispatch(getDetailPosition(a));
    dispatch(showFormPosition(true));
    setIsEdit(false);
    setFormBtnTitle(t('position.edit'));
    setFormTitle(t('position.editPosition'));
  };
  const handleConfirmOk = async id => {
    try {
      console.log(id);
      const res = await positionApi.deletePositionById(id);
      console.log(res);
      setLoading(true);
      dispatch(setReloadTalbe());
      message.success(t('position.successDelete'));
    } catch (error) {
      console.log(error);
    }
  };
  const getData = async () => {
    try {
      const params = { ...listParams };
      convertArrayToParamsWithDash(params);
      const { data } = await positionApi.getPositionByPage(params);
      setLoading(false);
      if (data.status === 'success') {
        dispatch(getAllPosition(data.data));
        dispatch(setTotalPosition(data.total));
        onChangeListParams(prev => ({
          ...prev,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    let unMounted = false;
    if (!unMounted) {
      getData();
    }
    return () => {
      unMounted = true;
    };
  }, [reloadTable]);

  return (
    <FullScreen handle={handleFullScreen}>
      <div className="position__table">
        <TableButton
          columns={columns}
          setColumns={setColumns}
          handleFullScreen={handleFullScreen}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowkeys={setSelectedRowkeys}
          loading={loading}
          setLoading={setLoading}
        />
        <Table
          rowKey={'id'}
          rowSelection={rowSelection}
          columns={columns.filter(item => item.hide === true)}
          dataSource={dataPosition}
          loading={loading}
          size="1202px"
          scroll={{ x: 900 }}
          onChange={onChange}
          pagination={{
            ...CONFIG_PAGINATION,
            pageSize: limit,
            current: Number(listParams.page),
            total: totalPosition,
          }}
        />
      </div>
    </FullScreen>
  );
}

export default PositionTable;
