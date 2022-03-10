/*
Title: Đây là component hình thức làm việc
author: Nguyễn GIang Nam
Version: 1.0
Last Update: 15h 22/02/2022
*/

import {
  EllipsisOutlined,
  PlusCircleFilled,
  PlusCircleOutlined,
} from '@ant-design/icons';

import { Button, Table, Menu, Dropdown, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import cvApi from '../../api/cvApi';
import {
  DEFAULT_FILTER,
  CONFIG_PAGINATION,
  CV_STEP,
  DATE_TIME_FORMAT,
  DATE_FORMAT_ONBOARD,
} from '../../constants';
import Filter from './component/Filter';
import TableButton from '../Settings/User/userBody/userTable/tableButton';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { settingUserApi } from '../../api/settingUserApi';
import { LEVEL_API, POSITION_URL, USER_URL } from '../../constants/api';
import { Excel } from 'antd-table-saveas-excel';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import AddCV from './component/Add';

function CvManagerment(props) {
  const { t } = useTranslation();
  const stepStatus = row => {
    const step = CV_STEP[row.step];
    if (row.status > -1) {
      const status = step.status[row.status];
      return (
        <>
          <b style={{ color: step.color }}>{t('cv.' + step.title)}</b> -{' '}
          <b style={{ color: status.color }}>{t('cv.' + status.title)}</b>
        </>
      );
    } else {
      return <b style={{ color: step.color }}>{t('cv.' + step.title)}</b>;
    }
  };
  const defaulColumns = [
    {
      title: t('cv.id'),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      show: true,
      export: true,
      showSorterTooltip: {
        title: t('language.titleChangeSorter'),
      },
      sorter: true,
    },
    {
      title: t('cv.name'),
      dataIndex: 'fullname',
      key: 'fullname',
      showSorterTooltip: {
        title: t('language.titleChangeSorter'),
      },
      show: true,
      sorter: true,
      export: true,
    },
    {
      title: t('cv.position'),
      dataIndex: 'position_title',
      key: 'position_title',
      showSorterTooltip: {
        title: t('language.titleChangeSorter'),
      },
      show: true,
      sorter: true,
      export: true,
    },
    {
      title: t('cv.level'),
      dataIndex: 'level_title',
      key: 'level_title',
      show: true,
      sorter: true,
      showSorterTooltip: {
        title: t('language.titleChangeSorter'),
      },
      export: true,
    },
    {
      title: t('cv.status'),
      dataIndex: 'status',
      key: 'status',
      show: true,
      sorter: true,
      showSorterTooltip: {
        title: t('language.titleChangeSorter'),
      },
      export: true,
      render: (value, row) => stepStatus(row),
    },
    {
      title: t('cv.appointment'),
      dataIndex: 'appoint_date',
      key: 'appoint_date',
      align: 'center',
      sorter: true,
      showSorterTooltip: {
        title: t('language.titleChangeSorter'),
      },
      show: true,
      export: true,
      render: value =>
        value ? moment(value * 1000).format(DATE_TIME_FORMAT) : '-',
    },
    {
      title: t('cv.assignee'),
      dataIndex: 'interviewer_id',
      key: 'interviewer_id',
      align: 'center',
      showSorterTooltip: {
        title: t('language.titleChangeSorter'),
      },
      show: true,
      export: true,
      sorter: true,
    },
    {
      title: t('cv.lastUpdate'),
      dataIndex: 'datemodified',
      key: 'datemodified',
      align: 'center',
      sorter: true,
      showSorterTooltip: {
        title: t('language.titleChangeSorter'),
      },
      show: true,
      export: true,
      render: value => moment(value * 1000).format(DATE_TIME_FORMAT),
    },
    {
      title: t('cv.onboard'),
      dataIndex: 'onboard',
      key: 'onboard',
      align: 'center',
      show: true,
      export: true,
      render: value =>
        value ? moment(value).format(DATE_FORMAT_ONBOARD) : '-',
    },
    {
      title: t('cv.action'),
      dataIndex: 'id',
      key: 'action',
      width: '10%',
      render: id => (
        <div className="table__actions">
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item className="p-2">
                  <Link to={'/cv/' + id}>Detail</Link>
                </Menu.Item>
                <Menu.Item className="p-2">Delete</Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <EllipsisOutlined className="ellipsis" />
          </Dropdown>
        </div>
      ),
      show: true,
      export: false,
    },
  ];

  const [loading, setLoading] = useState(false); //Lưu trạng thái loading
  const [list, setList] = useState([]); //Lưu danh sách dữ liệu của trang hiện tại
  const [filter, setFilter] = useState(DEFAULT_FILTER); //Cấu hình filter mặc định cho API
  const [columns, setColumns] = useState(defaulColumns); //Lưu danh sách các cột
  const [totalRecord, setTotalRecord] = useState(0); //Lưu số lượng tất cả dữ liệu
  const [posApi, setPosApi] = useState({}); //lấy vị trí từ api
  const [levelApi, setLevelApi] = useState([]); //lấy trình độ từ api
  const [assignApi, setAssignApi] = useState([]); //lấy Asignee từ api
  const [visibleDrawer, setVisibleDrawer] = useState(false); // đóng mở drawer add

  const handleFullscreen = useFullScreenHandle();

  useEffect(() => {
    let unmount = false;
    setLoading(true);
    cvApi
      .getAll(filter)
      .then(res => {
        if (res.data.status === 'success') {
          if (unmount === false) {
            setList(res.data.data);
            setTotalRecord(res.data.total);
          }
        }
        if (unmount === false) {
          setLoading(false);
        }
      })
      .catch(e => {
        console.log(e);
        //Thông báo lỗi sau
        if (unmount === false) {
          setLoading(false);
        }
      });
    return () => {
      unmount = true;
    };
  }, [filter]);
  useEffect(() => {
    fetchPosition();
    fetchLevel();
    fetchAssignee();
  }, []);
  //fetch data
  const fetchPosition = async () => {
    try {
      const res = await settingUserApi.getAll(POSITION_URL, {
        status: 1,
        limit: 0,
      });
      if (res.data.status === 'success') {
        const listPos = res.data.data.reduce((groups, item) => {
          const group = groups[item.parent_title] || [];
          group.push(item);
          groups[item.parent_title] = group;
          return groups;
        }, {});

        setPosApi(listPos);
      }
    } catch (err) {
      message.error(err.message);
    }
  };
  const fetchLevel = async () => {
    try {
      const res = await settingUserApi.getAll(LEVEL_API, {
        status: 1,
        limit: 0,
      });
      if (res.data.status === 'success') {
        setLevelApi(res.data.data);
      }
    } catch (err) {
      message.error(err.message);
    }
  };
  const fetchAssignee = async () => {
    try {
      const res = await settingUserApi.getAll(USER_URL, {
        status: 1,
        limit: 0,
      });
      if (res.data.status === 'success') {
        setAssignApi(res.data.data);
      }
    } catch (err) {
      message.error(err.message);
    }
  };
  //Hàm Onchange
  const onChange = (e, filter, sorter) => {
    console.log(e);
    setFilter({
      ...filter,
      page: e.current,
      limit: e.pageSize,
      orderby: sorter.field
        ? `${sorter.field}-${
            sorter.order === 'descend'
              ? 'DESC'
              : sorter.order === 'ascend'
              ? 'ASC'
              : ''
          }`
        : '',
    });
  };
  // hàm xuất file
  const handleExport = async () => {
    console.log('exporting');
    try {
      const excel = new Excel();
      const res = await cvApi.getAll({
        ...filter,
        total: totalRecord,
      });
      if (res.data.status === 'success') {
        const fillCol = columns.filter(e => e.export && e.show);
        excel
          .addSheet('CV')
          .addColumns(
            fillCol.map(e => {
              if (e.dataIndex === 'status') {
                e.render = value => (value ? t('user.access') : t('user.lock'));
              }
              return e;
            }),
          )
          .addDataSource(res.data.data)
          .saveAs('CV.xlsx');
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  //Bấm nút tạo mới
  const handleCreate = e => {
    setVisibleDrawer(true);
  };

  return (
    <div className="">
      <AddCV
        visibleDrawer={visibleDrawer}
        setVisibleDrawer={setVisibleDrawer}
      />
      <div className="cv__managerment">
        <div className="header-list">
          <h3>{t('cv.mainTitle')}</h3>
          <Button
            onClick={handleCreate}
            type="primary"
            icon={<PlusCircleFilled />}
          >
            {t('cv.createNew')}
          </Button>
        </div>
        <div className="cv__managerment--content">
          <Filter
            {...filter}
            setFilter={setFilter}
            levelApi={levelApi}
            posApi={posApi}
            assignApi={assignApi}
          />
          <div className="table__content">
            <TableButton
              columns={columns}
              setColumns={setColumns}
              className="table-button"
              handleExport={handleExport}
              handleFullscreen={handleFullscreen}
            />
            <FullScreen
              handle={handleFullscreen}
              className="fullscreen-box table__content--detail"
            >
              <Table
                dataSource={list}
                columns={columns.filter(e => e.show)}
                size="default"
                loading={loading}
                onChange={onChange}
                pagination={{
                  ...CONFIG_PAGINATION,
                  pageSize: filter.limit,
                  total: totalRecord,
                }}
                rowKey="id"
              />
            </FullScreen>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CvManagerment;
