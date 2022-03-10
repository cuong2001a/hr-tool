import React, { useEffect, useRef, useState } from 'react';
import { Table, Popover, Modal, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import {
  DEFAULT_FILTER,
  LIST_STATUS,
  CONFIG_PAGINATION,
} from '../../../constants/settingSource';
import { setIsFormShowed, setFormInterface } from './sourceSlice';
import {
  EllipsisOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from '@ant-design/icons/lib/icons';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import EditForm from './EditForm';
import sourceApi from '../../../api/sourceApi';
import UtilityIcons from './UtilityIcons';
import Search from './Search';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Data({ setInitialForm, initialForm }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [isFormShowed] = useSelector(state => [state.source.isFormShowed]);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(() => {
    const searchParam = queryString.parse(location.search, {
      parseNumbers: true,
    });
    if (Object.keys(searchParam).length === 0) return DEFAULT_FILTER;
    return searchParam || DEFAULT_FILTER;
  });
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const [total, setTotal] = useState(0);

  const handleFullScreen = useFullScreenHandle();
  const getDefaultSortOrder = col => {
    const { orderby } = filter;
    if (!orderby) return false;
    if (!orderby.includes(col)) return false;
    else {
      if (orderby.includes('ASC')) return 'ascend';
      if (orderby.includes('DESC')) return 'descend';
    }
  };

  const defaultColumns = [
    {
      id: 1,
      title: t('source.idColumn'),
      dataIndex: 'id',
      width: '3%',
      sorter: true,
      defaultSortOrder: getDefaultSortOrder('id'),
      show: true,
      export: true,
    },
    {
      id: 2,
      title: t('source.titleColumn'),
      dataIndex: 'title',
      width: 155,
      sorter: true,
      defaultSortOrder: getDefaultSortOrder('title'),
      show: true,
      export: true,
      render: value => <div className="title-limit">{value}</div>,
    },
    {
      id: 3,
      title: t('source.descriptionColumn'),
      dataIndex: 'description',
      width: 805,
      sorter: true,
      defaultSortOrder: getDefaultSortOrder('description'),
      show: true,
      export: true,
      render: value => <div className="title-limit">{value}</div>,
    },
    {
      id: 4,
      title: t('source.statusColumn'),
      dataIndex: 'status',
      width: 120,
      align: 'center',
      show: true,
      export: true,
      render: value => {
        if (value) {
          return <CheckCircleFilled className="check-icon" />;
        } else {
          return <CloseCircleFilled className="close-icon" />;
        }
      },
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
      id: 5,
      title: t('source.actionColumn'),
      width: 120,
      show: true,
      export: false,
      render: (_, record) => {
        return (
          <div>
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
          </div>
        );
      },
      align: 'center',
    },
  ];

  const [columns, setColumns] = useState(defaultColumns);

  let unmount = useRef(false);

  useEffect(async () => {
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

  const fetchApi = async () => {
    try {
      setLoading(true);
      const data = await sourceApi.getAll({
        ...filter,
        keyword: filter.keyword?.trim(),
      });
      if (data.data.status === 'success') {
        if (unmount.current === false) {
          setSources(data.data.data);
          setTotal(data.data.total);
        }
      }
      if (unmount.current === false) setLoading(false);
      if (data.data.totalpage < filter.page)
        setFilter({ ...filter, page: data.data.totalpage });
    } catch (e) {
      console.log(e);
      if (unmount.current === false) {
        setLoading(false);
      }
    }
  };

  const handleEditEvent = record => {
    setInitialForm(record);
    dispatch(setIsFormShowed(true));
    dispatch(
      setFormInterface({
        btn: t('source.editBtn'),
        title: t('source.editTitle'),
      }),
    );
  };

  const handleDeleteEvent = async id => {
    await sourceApi.delete(id);
    fetchApi();
  };

  const actionContent = record => (
    <div className="action-content">
      <Button icon={<EditOutlined />} onClick={() => handleEditEvent(record)}>
        {t('source.editAction')}
      </Button>
      <Button
        icon={<DeleteOutlined />}
        onClick={() => confirm(undefined, record.id)}
      >
        {t('source.deleteAction')}
      </Button>
    </div>
  );

  function confirm(_, id) {
    Modal.confirm({
      title: t('source.titleConfirm'),
      icon: <ExclamationCircleOutlined />,
      content: t('source.contentConfirm'),
      okText: t('source.okConfirm'),
      cancelText: t('source.cancelConfirm'),
      onOk: () => handleDeleteEvent(id),
    });
  }

  const onChangeTable = (e, filterParam, sorter) => {
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

  return (
    <>
      <Search filter={filter} setFilter={setFilter} />
      <FullScreen
        handle={handleFullScreen}
        className="source__table-fullscreen"
      >
        <div className="source__table">
          <UtilityIcons
            handleFullScreen={handleFullScreen}
            columns={columns}
            setColumns={setColumns}
            filter={filter}
            total={total}
          />
          <Table
            rowKey="id"
            columns={columns.filter(col => col.show)}
            dataSource={sources}
            loading={loading}
            locale={{
              triggerDesc: t('source.triggerDesc'),
              triggerAsc: t('source.triggerAsc'),
              cancelSort: t('source.cancelSort'),
            }}
            onChange={onChangeTable}
            pagination={{
              ...CONFIG_PAGINATION,
              pageSize: filter.limit,
              total: total,
              current: filter.page,
            }}
          />
          <EditForm
            {...CONFIG_PAGINATION}
            isFormShowed={isFormShowed}
            setIsFormShowed={setIsFormShowed}
            fetchApi={fetchApi}
            initialForm={initialForm}
          />
        </div>
      </FullScreen>
    </>
  );
}
