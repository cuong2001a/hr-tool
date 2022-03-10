import { StopOutlined } from '@ant-design/icons';
import { Button, message, Modal, Popover, Table } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import languageApi from '../../../../../api/languageApi';
import { getLevel } from '../../../../../api/level/levelApi';
import { positionApi } from '../../../../../api/positionApi';
import requestApi from '../../../../../api/requestApi';
import typeworkApi from '../../../../../api/typeworkApi';
import removeIcon from '../../../../../assets/images/request/DeleteOutlined.svg';
import editIcon from '../../../../../assets/images/request/Edit.svg';
import detailIcon from '../../../../../assets/images/request/InfoCircle.svg';
import { CONFIG_PAGINATION } from '../../../../../constants';
import {
  checkOrderbyValue,
  ThreeDotIcon,
} from '../../../../../constants/languagePage';
import {
  DATE_FORMAT_DAY_CREATED,
  DATE_FORMAT_DEADLINE,
  DEFAULT_PRIORITY,
  DETAIL_TITLE_FORM,
  EDIT_TITLE_FORM,
  LIST_ASSESSMENT,
  LIST_REQUEST_STATUS,
  PARAMS_GET_ALL,
} from '../../../../../constants/requestPage';
import {
  changeVisibleRequestForm,
  setListLanguages,
  setListLevel,
  setListPosition,
  setListTypeWork,
  setReloadTable,
  setRequestFormInfo,
  setTotalRecords,
} from '../../../requestSlice';

function ContentRequestTable({
  listParams,
  onChangeListParams,
  onChangeTitleForm,
  onChangeTitleButtonForm,
  listColumns,
  onChangeColumns,
}) {
  const { t } = useTranslation();
  const [listRequest, setListRequest] = useState([]);
  const dispatch = useDispatch();
  let unMounted = useRef(false);

  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const isReloadTable = useSelector(state => state.request.isReloadTable);
  const totalRecords = useSelector(state => state.request.totalRecords);

  const ContentAction = ({ record }) => {
    return (
      <div className="request__action">
        <Button
          className="request__action--detail"
          icon={<img src={detailIcon} alt="detail" />}
          size="large"
          onClick={() => handleRequestDetail(record)}
        >
          {t('request.detail')}
        </Button>
        <Button
          className="request__action--edit"
          icon={<img src={editIcon} alt="detail" />}
          size="large"
          onClick={() => handleEditRequest(record)}
        >
          {t('request.edit')}
        </Button>
        <Button
          className="request__action--remove"
          icon={<img src={removeIcon} alt="detail" />}
          size="large"
          onClick={() => handleRemoveRequest(record)}
        >
          {t('request.remove')}
        </Button>
      </div>
    );
  };

  const fetchListLevel = async () => {
    try {
      // call api get list level with status = 1
      const response = await getLevel(PARAMS_GET_ALL);
      dispatch(setListLevel(response.data.data));
    } catch (error) {
      message.error(t('request.failToFetchListLevel'));
    }
  };

  const fetchListTypeWork = async () => {
    try {
      // call api get list level with status = 1
      const response = await typeworkApi.getAll(PARAMS_GET_ALL);
      dispatch(setListTypeWork(response.data.data));
    } catch (error) {
      message.error(t('request.failToFetchListTypeWork'));
    }
  };

  const fetchListPosition = async () => {
    try {
      // call api get list level with status = 1
      const response = await positionApi.getAllPosition(PARAMS_GET_ALL);
      dispatch(setListPosition(response.data.data));
    } catch (error) {
      message.error(t('request.failToFetchListTypeWork'));
    }
  };

  const fetchListLanguages = async () => {
    try {
      // call api get list level with status = 1
      const response = await languageApi.getAll(PARAMS_GET_ALL);
      dispatch(setListLanguages(response.data.data));
    } catch (error) {
      message.error(t('request.failToFetchListTypeWork'));
    }
  };

  const handleRequestDetail = record => {
    dispatch(setRequestFormInfo(record));
    onChangeTitleForm(DETAIL_TITLE_FORM);
    onChangeTitleButtonForm(t('request.titleApproveRequest'));
    dispatch(changeVisibleRequestForm(true));
  };

  const handleEditRequest = async record => {
    dispatch(setRequestFormInfo(record));
    onChangeTitleForm(EDIT_TITLE_FORM);
    onChangeTitleButtonForm(t('request.titleButtonEditForm'));

    try {
      await Promise.all([
        fetchListLevel(),
        fetchListTypeWork(),
        fetchListPosition(),
        fetchListLanguages(),
      ]);

      dispatch(changeVisibleRequestForm(true));
    } catch (error) {
      message.error(t('request.failToEditRequest'));
    }
  };

  const handleRemoveRequest = async record => {
    try {
      Modal.confirm({
        title: t('request.confirmTextRemoveRequest'),
        centered: true,
        content: record.author_id,
        onOk() {
          handleConfirmOk(record.id);
        },
        okType: 'danger',
        okText: t('request.remove'),
        cancelText: t('request.cancel'),
        width: 450,
        icon: <StopOutlined style={{ color: '#f00' }} />,
      });
    } catch (error) {
      throw new Error('Fail to load language id');
    }
  };

  const handleConfirmOk = async requestId => {
    try {
      await requestApi.delete(requestId);
      message.success(t('request.deleteSuccessText'));
      dispatch(setReloadTable());
    } catch (error) {
      message.error(t('request.deleteFailText'));
    }
  };

  useEffect(() => {
    fetchAllListRequest();
  }, [isReloadTable]);

  const fetchAllListRequest = async () => {
    try {
      const response = await requestApi.getAll(listParams);

      if (!unMounted.current) {
        setListRequest(response.data.data);
        dispatch(setTotalRecords(response.data.total));
        setIsLoadingTable(false);
      }
    } catch (error) {
      if (!unMounted.current) {
        message.error(t('request.failToFetchListRequest'));
      }
    }
  };

  const defaultColumns = [
    {
      id: 1,
      title: 'ID',
      dataIndex: 'id',
      key: 'key',
      align: 'center',
      showSorterTooltip: {
        title: t('request.titleChangeSorter'),
      },
      sorter: true,
      defaultSortOrder: checkOrderbyValue(listParams, 'id'),
      isShow: true,
      hasExported: true,
    },
    {
      id: 2,
      title: t('request.department'),
      dataIndex: 'department_title',
      key: 'key',
      align: 'center',
      showSorterTooltip: {
        title: t('request.titleChangeSorter'),
      },
      isShow: true,
      hasExported: true,
    },
    {
      id: 3,
      title: t('request.position'),
      dataIndex: 'position_title',
      key: 'position_title',
      showSorterTooltip: {
        title: t('request.titleChangeSorter'),
      },
      isShow: true,
      hasExported: true,
    },
    {
      id: 4,
      title: t('request.dateCreated'),
      dataIndex: 'datecreate',
      key: 'datecreate',
      showSorterTooltip: {
        title: t('request.titleChangeSorter'),
      },
      sorter: true,
      defaultSortOrder: checkOrderbyValue(listParams, 'datecreate'),
      isShow: true,
      hasExported: true,
      render: datecreate => {
        return dayjs(datecreate * 1000).format(DATE_FORMAT_DAY_CREATED);
      },
    },
    {
      id: 5,
      title: t('request.requestor'),
      dataIndex: 'requestor_id',
      key: 'requestor_id',
      showSorterTooltip: {
        title: t('request.titleChangeSorter'),
      },
      sorter: true,
      defaultSortOrder: checkOrderbyValue(listParams, 'requestor_id'),
      isShow: true,
      hasExported: true,
    },
    {
      id: 6,
      title: t('request.totalCv'),
      dataIndex: 'target',
      key: 'target',
      showSorterTooltip: {
        title: t('request.titleChangeSorter'),
      },
      sorter: true,
      defaultSortOrder: checkOrderbyValue(listParams, 'target'),
      isShow: true,
      hasExported: true,
    },
    {
      id: 7,
      title: t('request.level'),
      dataIndex: 'level_title',
      key: 'level_title',
      showSorterTooltip: {
        title: t('request.titleChangeSorter'),
      },
      isShow: true,
      hasExported: true,
    },
    {
      id: 8,
      title: t('request.language'),
      dataIndex: 'languages',
      key: 'languages',
      showSorterTooltip: {
        title: t('request.titleChangeSorter'),
      },
      render: languages => {
        return (
          (languages && (
            <div className="text-truncate">
              {JSON.parse(languages).join(', ')}
            </div>
          )) ||
          '-'
        );
      },
      align: 'center',
      isShow: true,
      hasExported: true,
    },
    {
      id: 9,
      title: t('request.priority'),
      dataIndex: 'priority',
      key: 'priority',
      showSorterTooltip: {
        title: t('request.titleChangeSorter'),
      },
      sorter: true,
      defaultSortOrder: checkOrderbyValue(listParams, 'priority'),
      render: priority => {
        return DEFAULT_PRIORITY[priority]?.title ?? '-';
      },
      isShow: true,
      hasExported: true,
    },
    {
      id: 10,
      title: t('request.rate'),
      dataIndex: 'assessment',
      key: 'assessment',
      showSorterTooltip: {
        title: t('request.titleChangeSorter'),
      },
      sorter: true,
      defaultSortOrder: checkOrderbyValue(listParams, 'assessment'),
      render: assessment => {
        // assessment range : 0 -> 3 (if null render `-`)
        return LIST_ASSESSMENT[assessment]?.title ?? '-';
      },
      isShow: true,
      hasExported: true,
    },
    {
      id: 11,
      title: t('request.status'),
      key: 'status',
      dataIndex: 'status',
      width: '10%',
      align: 'center',
      sorter: true,
      defaultSortOrder: checkOrderbyValue(listParams, 'status'),
      render: status => {
        const { color, text } = LIST_REQUEST_STATUS.find(
          item => item.value === status,
        );
        return <span style={{ color }}>{text}</span>;
      },
      isShow: true,
      hasExported: true,
    },
    {
      id: 12,
      title: t('request.deadline'),
      width: '10%',
      align: 'center',
      render: (_, record) => {
        return dayjs(`${record.year}-${record.month}`).format(
          DATE_FORMAT_DEADLINE,
        );
      },
      isShow: true,
      hasExported: true,
    },
    {
      id: 13,
      title: t('request.action'),
      key: 'action',
      width: '10%',
      align: 'center',
      render: (_, record) => {
        return (
          <Popover
            zIndex={1}
            content={<ContentAction record={record} />}
            trigger={'hover'}
            placement="bottom"
          >
            <Button ghost icon={<ThreeDotIcon />} className="table__action" />
          </Popover>
        );
      },
      isShow: true,
      hasExported: false,
    },
  ];

  useEffect(() => {
    onChangeColumns(defaultColumns);
  }, []);

  const handleChangeTableData = (pagination, filter, sorter) => {
    const orderbyValue = sorter?.field
      ? `${sorter.field}-${sorter.order === 'ascend' ? 'ASC' : 'DESC'}`
      : '';
    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      orderby: sorter.order ? orderbyValue : '',
    };

    onChangeListParams(prev => ({ ...prev, ...params }));
    dispatch(setReloadTable());
  };

  return (
    <>
      <Table
        columns={listColumns.filter(col => col.isShow)}
        dataSource={listRequest}
        rowKey="id"
        loading={isLoadingTable}
        onChange={handleChangeTableData}
        pagination={{
          ...CONFIG_PAGINATION,
          pageSize: 10,
          total: totalRecords,
          hideOnSinglePage: false,
          size: 'default',
          current: parseInt(listParams.page),
        }}
      />
    </>
  );
}

export default ContentRequestTable;
