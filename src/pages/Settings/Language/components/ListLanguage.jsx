import { ExclamationCircleOutlined, StopOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons/lib/components/AntdIcon';
import {
  Button,
  Divider,
  Dropdown,
  Menu,
  message,
  Modal,
  Pagination,
  Popover,
  Table,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import languageApi from '../../../../api/languageApi';
import { CONFIG_PAGINATION } from '../../../../constants';
import {
  checkOrderbyValue,
  checkStatusFilteredValue,
  LIST_STATUS,
  ThreeDotIcon,
} from '../../../../constants/languagePage';
import { convertArrayToParamsWithDash } from '../../../../utils/convertArrayToParamsWithDash';
import HeaderTableButton from '../components/HeaderTableButton';
import {
  setListLanguage,
  setReloadTable,
  setTotalRecords,
  setVisibleFormLang,
} from '../languageSlice';
import removeIcon from '../../../../assets/images/request/DeleteOutlined.svg';
import editIcon from '../../../../assets/images/request/Edit.svg';

function ListLanguage({
  setValueALang,
  loadingTable,
  onLoadingTable,
  onChangeListParams,
  listParams,
  onChangeFormTitle,
  onChangeFormBtnTitle,
}) {
  const { limit } = listParams;
  const handleFullScreen = useFullScreenHandle();

  const [listColumns, setListColumns] = useState([]);

  const reloadTable = useSelector(state => state.filterLang.reloadTable);
  const listLanguage = useSelector(state => state.filterLang.listLanguage);
  const totalRecords = useSelector(state => state.filterLang.totalRecords);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const ContentAction = ({ record }) => {
    return (
      <div className="language__action">
        <Button
          className="language__action--edit"
          icon={<img src={editIcon} alt="detail" />}
          size="large"
          onClick={() => handleEditLanguage(record)}
        >
          {t('request.edit')}
        </Button>
        <Button
          className="language__action--remove"
          icon={<img src={removeIcon} alt="detail" />}
          size="large"
          onClick={() => handleRemoveLanguage(record)}
        >
          {t('request.remove')}
        </Button>
      </div>
    );
  };

  const handleEditLanguage = record => {
    try {
      setValueALang(record);
      onChangeFormTitle(t('language.titleEditLang'));
      onChangeFormBtnTitle(t('language.titleBtnEditLang'));
      dispatch(setVisibleFormLang(true));
    } catch (error) {
      throw new Error('Fail to load language id');
    }
  };

  const handleRemoveLanguage = async record => {
    try {
      Modal.confirm({
        title: t('language.confirmTextRemoveLang'),
        icon: <ExclamationCircleOutlined />,
        centered: true,
        content: record.title,
        onOk() {
          handleConfirmOk(record.id);
        },
        okType: 'danger',
        okText: t('language.remove'),
        cancelText: t('language.cancel'),
        width: 450,
        icon: <StopOutlined style={{ color: '#f00' }} />,
      });
    } catch (error) {
      throw new Error('Fail to load language id');
    }
  };

  const handleConfirmOk = async languageId => {
    try {
      await languageApi.delete(languageId);
      dispatch(setReloadTable());
      message.success(t('language.deleteLanguageSuccess'));
      onLoadingTable(true);
    } catch (error) {
      message.success(t('language.deleteLanguageFail'));
      throw new Error('Fail to delete language');
    }
  };

  const fetchListAllLanguage = async () => {
    try {
      const params = { ...listParams };
      convertArrayToParamsWithDash(params);

      //call language api
      const response = await languageApi.getAll(params);
      onLoadingTable(false);
      dispatch(setListLanguage(response.data.data));
      dispatch(setTotalRecords(response.data.total));
      onChangeListParams(prev => ({
        ...prev,
      }));
    } catch (error) {
      message.error(t('language.networkError'));
      throw new Error('Fail to fetch list language');
    }
  };

  useEffect(() => {
    let unMounted = false;
    if (!unMounted) {
      fetchListAllLanguage();
    }
    return () => {
      unMounted = true;
    };
  }, [reloadTable]);

  const defaultColumns = [
    {
      id: 1,
      title: 'ID',
      dataIndex: 'id',
      key: 'key',
      width: '5%',
      align: 'center',
      showSorterTooltip: {
        title: t('language.titleChangeSorter'),
      },
      sorter: true,
      defaultSortOrder: checkOrderbyValue(listParams, 'id'),
      isShow: true,
      hasExported: true,
    },
    {
      id: 2,
      title: t('language.title'),
      dataIndex: 'title',
      key: 'title',
      width: '15%',
      showSorterTooltip: {
        title: t('language.titleChangeSorter'),
      },
      render: title => <div className="text-truncate">{title}</div>,
      sorter: true,
      defaultSortOrder: checkOrderbyValue(listParams, 'title'),
      isShow: true,
      hasExported: true,
    },
    {
      id: 3,
      title: t('language.description'),
      dataIndex: 'description',
      key: 'description',
      showSorterTooltip: {
        title: t('language.titleChangeSorter'),
      },
      render: description => <div className="text-truncate">{description}</div>,
      sorter: true,
      defaultSortOrder: checkOrderbyValue(listParams, 'description'),
      isShow: true,
      hasExported: true,
    },
    {
      id: 4,
      title: t('language.status'),
      key: 'status',
      dataIndex: 'status',
      width: '10%',
      align: 'center',
      render: status => {
        return LIST_STATUS.find(item => item.value === status).icon;
      },
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
      defaultFilteredValue: checkStatusFilteredValue(listParams),
      isShow: true,
      hasExported: true,
    },
    {
      id: 5,
      title: t('language.action'),
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
    let unMounted = false;
    if (!unMounted) {
      setListColumns(defaultColumns);
    }
    return () => {
      unMounted = true;
    };
  }, []);

  const handleChangeParamsTable = (pagination, filter, sorter) => {
    const statusFiltered = filter.status ?? [];
    const orderbyValue = sorter?.field
      ? `${sorter.field}-${sorter.order === 'ascend' ? 'ASC' : 'DESC'}`
      : '';

    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      orderby: orderbyValue,
      status: statusFiltered.length ? statusFiltered.join('-') : '',
    };
    onChangeListParams(prev => ({ ...prev, ...params }));
    dispatch(setReloadTable());
  };

  return (
    <div className="table">
      <FullScreen handle={handleFullScreen} className="language__fullscreen">
        <div className="table__shadow">
          <HeaderTableButton
            handleFullScreen={handleFullScreen}
            listColumns={listColumns}
            listParams={listParams}
            onChangeListColumns={setListColumns}
          />
          <Table
            dataSource={listLanguage}
            columns={listColumns.filter(col => col.isShow)}
            size="middle"
            loading={loadingTable}
            onChange={handleChangeParamsTable}
            rowKey="id"
            pagination={{
              ...CONFIG_PAGINATION,
              pageSize: limit,
              total: totalRecords,
              hideOnSinglePage: false,
              current: parseInt(listParams.page),
              size: 'default',
            }}
          />
        </div>
      </FullScreen>
    </div>
  );
}

export default ListLanguage;
