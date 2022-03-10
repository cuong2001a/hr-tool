/*
Title: Đây là component hình thức làm việc
author: Nguyễn GIang Nam
Version: 1.0
Last Update: 15h 22/02/2022
*/

import {
  CheckCircleFilled,
  CloseCircleFilled,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleFilled,
} from '@ant-design/icons';
import { Button, Popover, Table, Modal } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import typeworkApi from '../../../api/typeworkApi';
import { DEFAULT_FILTER, CONFIG_PAGINATION } from '../../../constants';
import Filter from './component/Filter';
import ActionBar from './component/ActionBar';
import EditForm from './component/EditForm';
import queryString from 'query-string';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useLocation, useNavigate } from 'react-router-dom';

function TypeWork(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const handleFullScreen = useFullScreenHandle();

  const [filter, setFilter] = useState(() => {
    const searchParam = queryString.parse(location.search, {
      parseNumbers: true,
    });
    if (Object.keys(searchParam).length === 0) return DEFAULT_FILTER;
    return searchParam || DEFAULT_FILTER;
  });

  const getDefaultSortOrder = col => {
    const { orderby } = filter;
    if (!orderby) return false;
    if (!orderby.includes(col)) return false;
    else {
      if (orderby.includes('ASC')) return 'ascend';
      if (orderby.includes('DESC')) return 'descend';
    }
  };

  const defaulColumns = [
    {
      title: t('typework.id'),
      id: 1,
      width: 41,
      dataIndex: 'id',
      defaultSortOrder: getDefaultSortOrder('id'),
      show: true,
      export: true,
      sorter: true,
    },
    {
      title: t('typework.title'),
      id: 2,
      dataIndex: 'title',
      defaultSortOrder: getDefaultSortOrder('title'),
      width: 155,
      show: true,
      export: true,
      sorter: true,
      render: value => <div className="title-limit">{value}</div>,
    },
    {
      title: t('typework.description'),
      id: 3,
      dataIndex: 'description',
      defaultSortOrder: getDefaultSortOrder('description'),
      width: 805,
      show: true,
      export: true,
      sorter: true,
      render: value => <div className="title-limit">{value}</div>,
    },
    {
      title: t('typework.status'),
      id: 4,
      width: 120,
      dataIndex: 'status',
      align: 'center',

      render: value => {
        if (value) {
          return <CheckCircleFilled className="check-icon" />;
        } else {
          return <CloseCircleFilled className="close-icon" />;
        }
      },
      show: true,
      export: true,
      defaultFilteredValue: `${filter.status}`,
      filters: [
        {
          text: t('source.active'),
          value: 1,
        },
        {
          text: t('source.locking'),
          value: 0,
        },
      ],
    },
    {
      title: t('typework.action'),
      id: 5,
      width: 120,
      dataIndex: 'id',
      align: 'center',
      render: (_, record) => {
        return (
          <Popover
            placement="bottom"
            content={actionContent(record)}
            trigger="hover"
            overlayClassName="overlayActionContent"
          >
            <span className="action-icon">
              <EllipsisOutlined />
            </span>
          </Popover>
        );
      },
      show: true,
      export: false,
    },
  ];

  const [loading, setLoading] = useState(false); //Lưu trạng thái loading
  const [list, setList] = useState([]); //Lưu danh sách dữ liệu của trang hiện tại

  const [columns, setColumns] = useState(defaulColumns); //Lưu danh sách các cột
  const [totalRecord, setTotalRecord] = useState(0); //Lưu số lượng tất cả dữ liệu
  const [formInterface, setFormInterface] = useState({});
  const [isFormShowed, setIsFormShowed] = useState(false);
  const [initialForm, setInitialForm] = useState({});

  let unmount = useRef(false);
  useEffect(() => {
    fetchApi();
    if (!unmount.current) {
      navigate({
        pathname: location.pathname,
        search: queryString.stringify(filter, {
          skipNull: true,
          skipEmptyString: true,
        }),
      });
    }
  }, [filter]);

  useEffect(() => {
    return () => {
      unmount.current = true;
    };
  }, []);

  const fetchApi = () => {
    setLoading(true);
    typeworkApi
      .getAll({
        ...filter,
        keyword: filter.keyword?.trim(),
      })
      .then(res => {
        if (res.data.status === 'success') {
          if (unmount.current === false) {
            setList(res.data.data);
            setTotalRecord(res.data.total);
          }
        }
        if (unmount.current === false) {
          setLoading(false);
        }
        if (res.data.totalpage < filter.page)
          setFilter({ ...filter, page: res.data.totalpage });
      })
      .catch(e => {
        console.log(e);
        if (unmount.current === false) {
          setLoading(false);
        }
      });
  };

  const actionContent = record => (
    <div className="action-content">
      <Button icon={<EditOutlined />} onClick={() => handleEditEvent(record)}>
        {t('typework.editAction')}
      </Button>
      <Button
        icon={<DeleteOutlined />}
        onClick={() => confirm(undefined, record.id)}
      >
        {t('typework.deleteAction')}
      </Button>
    </div>
  );

  function confirm(_, id) {
    Modal.confirm({
      title: t('typework.titleConfirm'),
      icon: <ExclamationCircleOutlined />,
      content: t('typework.contentConfirm'),
      okText: t('typework.okConfirm'),
      cancelText: t('typework.cancelConfirm'),
      onOk: () => handleDeleteEvent(id),
    });
  }

  const handleDeleteEvent = async id => {
    await typeworkApi.delete(id);
    fetchApi();
  };

  const handleEditEvent = record => {
    setInitialForm(record);
    setIsFormShowed(true);
    setFormInterface({
      btn: t('typework.editFormBtn'),
      title: t('typework.editFormTitle'),
    });
  };

  //Hàm Onchange
  const onChange = (e, filterParam, sorter) => {
    const sorterValue = sorter.order
      ? `${sorter.field}-${sorter.order === 'ascend' ? 'ASC' : 'DESC'}`
      : '';
    const newFilterParam = {};
    for (let key in filterParam) {
      newFilterParam[key] = filterParam[key] ? filterParam[key].join('-') : '';
    }
    setFilter({
      ...filter,
      page: e.current,
      limit: e.pageSize,
      orderby: sorterValue,
      ...newFilterParam,
    });
  };

  //Bấm nút tạo mới
  const handleCreate = () => {
    setInitialForm({});
    setFormInterface({
      title: t('typework.createFormTitle'),
      btn: t('typework.createFormBtn'),
    });
    setIsFormShowed(true);
  };

  return (
    <div className="box-list">
      <div className="header-list">
        <h3>{t('typework.mainTitle')}</h3>
        <Button
          onClick={handleCreate}
          type="primary"
          icon={<PlusCircleFilled />}
        >
          {t('typework.createNew')}
        </Button>
      </div>
      <Filter filter={filter} setFilter={setFilter} />
      <FullScreen handle={handleFullScreen} className="table-fullscreen">
        <div className="box-shadow">
          <ActionBar
            filter={{ ...filter, limit: totalRecord }}
            columns={columns}
            setColumns={setColumns}
            handleFullScreen={handleFullScreen}
          />
          <Table
            dataSource={list}
            columns={columns.filter(e => e.show)}
            loading={loading}
            onChange={onChange}
            rowKey="id"
            locale={{
              triggerDesc: t('typework.triggerDesc'),
              triggerAsc: t('typework.triggerAsc'),
              cancelSort: t('typework.cancelSort'),
            }}
            pagination={{
              ...CONFIG_PAGINATION,
              pageSize: filter.limit,
              total: totalRecord,
              current: filter.page,
            }}
          />
        </div>
      </FullScreen>

      <EditForm
        formInterface={formInterface}
        isFormShowed={isFormShowed}
        setIsFormShowed={setIsFormShowed}
        fetchApi={fetchApi}
        initialForm={initialForm}
      />
    </div>
  );
}

export default TypeWork;
