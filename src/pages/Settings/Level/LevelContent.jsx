import {
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, message, Modal, Popover, Space, Table, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteLevel, getLevel } from '../../../api/level/levelApi';
import TableButton from './TableButton';
import queryString from 'query-string';
import {
  DEFAULT_FILTER,
  LIST_STATUS,
  CONFIG_PAGINATION,
} from '../../../constants/settingSource';
import { t } from 'i18next';
import { setFormContent, setReloadTable, setVisibles } from './reducer/Level';
import FormGeneral from './Form';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchLevel from './SearchLevel';

function LevelContent() {
  const { searchQuery, visible } = useSelector(state => state.level);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const handle = useFullScreenHandle();
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

  const defaultColumns = [
    {
      id: 1,
      title: t('level.id'),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: '5%',
      defaultSortOrder: getDefaultSortOrder('id'),
      sorter: true,
      show: true,
      export: true,
    },
    {
      id: 2,
      title: t('level.level'),
      dataIndex: 'title',
      width: '10%',
      defaultSortOrder: getDefaultSortOrder('title'),
      show: true,
      sorter: true,
      export: true,

      render: value => <div className="title-limit">{value}</div>,
    },
    {
      id: 3,
      title: t('level.description'),
      defaultSortOrder: getDefaultSortOrder('description'),
      dataIndex: 'description',
      export: true,
      sorter: true,
      show: true,
      render: value => <div className="title-limit">{value}</div>,
    },
    {
      id: 4,
      title: t('level.status'),
      dataIndex: 'status',
      width: '10%',
      align: 'center',
      show: true,
      export: true,
      defaultFilteredValue: `${filter.status}`,
      filters: [
        {
          text: t('language.active'),
          value: 1,
        },
        {
          text: t('language.locking'),
          value: 0,
        },
      ],
      render: value => {
        if (value) {
          return <CheckCircleFilled className="check-icon" />;
        } else {
          return <CloseCircleFilled className="close-icon" />;
        }
      },
    },
    {
      id: 5,
      title: t('level.action'),
      dataIndex: 'action',
      width: '10%',
      align: 'center',
      show: true,
      export: false,
      render: (_, record) => {
        return (
          <>
            <Popover
              placement="bottom"
              trigger="hover"
              overlayClassName="overlayActionContent"
              content={<Content record={record} />}
            >
              <EllipsisOutlined
                style={{
                  fontSize: 22,
                  cursor: 'pointer',
                }}
              />
            </Popover>
          </>
        );
      },
    },
  ];

  const [columns, setColumns] = useState(defaultColumns);
  const [valueForm, setValueForm] = useState({});
  const [selectedRowKeys, setSelectedRowkeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [dataTable, setDataTable] = useState([]);

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
  const onSelectChange = selectedRowKeys => {
    console.log('selected', selectedRowKeys);
    setSelectedRowkeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const fetchApi = async () => {
    try {
      setLoading(true);
      const data = await getLevel({
        ...filter,
        keyword: filter.keyword?.trim(),
      });
      if (data.data.status === 'success') {
        if (unmount.current === false) {
          setDataTable(data.data.data);
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

  const Content = props => (
    <div className="action-content">
      <Button icon={<EditOutlined />} onClick={() => handleEdit(props.record)}>
        {t('source.editAction')}
      </Button>
      <Button icon={<DeleteOutlined />} onClick={() => confirm(props.record)}>
        {t('source.deleteAction')}
      </Button>
    </div>
  );
  function confirm(record) {
    Modal.confirm({
      title: t('source.titleConfirm'),
      icon: <ExclamationCircleOutlined />,
      content: t('source.contentConfirm'),
      okText: t('source.okConfirm'),
      cancelText: t('source.cancelConfirm'),
      onOk() {
        handleDeleteLevel(record);
      },
    });
  }

  const [columnsTable, setColumnsTable] = useState(columns);

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
  const handleEdit = async record => {
    setValueForm(record);
    dispatch(
      setFormContent({
        btn: t('source.editBtn'),
        title: t('level.levelTitleEdit'),
      }),
    );
    dispatch(setVisibles(true));
  };
  const handleDeleteLevel = async record => {
    const res = await deleteLevel(record.id);
    if (res.status === 200) {
      dispatch(setReloadTable());
      message.success(res.data.status);
    } else {
      message.error(res.data.message);
    }
    fetchApi();
  };

  return (
    <>
      <SearchLevel filter={filter} setFilter={setFilter} />

      <div className="level--table">
        <TableButton
          columns={columns}
          setColumns={setColumns}
          handleFullScreen={handle.enter}
          filter={filter}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowkeys={setSelectedRowkeys}
          loading={loading}
          setLoading={setLoading}
        />
        <FullScreen handle={handle} className="table-fullscreen">
          <Table
            rowSelection={rowSelection}
            rowKey="id"
            columns={columns.filter(col => col.show)}
            dataSource={dataTable}
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
        </FullScreen>
        <FormGeneral
          setVisibles={visible}
          fetchApi={fetchApi}
          valueForm={valueForm}
        />
      </div>
    </>
  );
}

export default LevelContent;
