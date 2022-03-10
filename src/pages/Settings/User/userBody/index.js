import {
  CheckCircleFilled,
  CloseCircleFilled,
  EllipsisOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { message, Popover, Space, Form, Modal, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { settingUserApi } from '../../../../api/settingUserApi';
import { ROLE_URL, USER_URL } from '../../../../constants/api';

import {
  changeSearchQuery,
  setReloadTable,
  changeVisibleDrawer,
  changeEdit,
} from '../../commonSlice/userSlice';
import { UserDrawer } from '../userModal';
import SearchForm from './searchForm';
import './userbody.scss';
import TableUser from './userTable';
import { useTranslation } from 'react-i18next';
import { messageAction } from './constant';
import edit from '../../../../assets/images/tableIcon/edit.svg';
import del from '../../../../assets/images/tableIcon/del.svg';
/**
 * @author
 * @function UserBody
 **/

const UserBody = props => {
  const { searchQuery, visibleDrawer, reloadTable, sorter } = useSelector(
    state => state.user,
  );
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [filter, setFilter] = useState('');
  const [dataTable, setDataTable] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [roleActiveApi, setRoleActiveApi] = useState([]);

  // table
  const DEFAULT_COLUMN = [
    {
      title: t('user.pageHeaderTitle'),
      dataIndex: 'username',
      key: 'username',
      width: '15%',
      sorter: true,
      showSorterTooltip: {
        title: t('language.titleChangeSorter'),
      },
      show: true,
      export: true,
      render: username => {
        return <div className="text-truncate">{username}</div>;
      },
    },
    {
      title: t('user.fullname'),
      dataIndex: 'fullname',
      key: 'fullname',
      width: '25%',
      sorter: true,
      showSorterTooltip: {
        title: t('language.titleChangeSorter'),
      },
      show: true,
      export: true,
      render: fullname => {
        return <div className="text-truncate">{fullname}</div>;
      },
    },
    {
      title: t('user.role_id'),
      key: 'role_title',
      dataIndex: 'role_title',
      width: '25%',
      show: true,
      export: true,
    },
    {
      title: t('user.email'),
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      show: true,
      showSorterTooltip: {
        title: t('language.titleChangeSorter'),
      },
      export: true,
      render: email => {
        return <div className="text-truncate">{email}</div>;
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
                deleteUser={deleteUser}
                t={t}
                showDrawerEdit={showDrawerEdit}
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
  const [form] = Form.useForm();

  const [columns, setColumn] = useState(DEFAULT_COLUMN);
  const showDrawerEdit = record => {
    dispatch(changeEdit(true));
    form.setFieldsValue({
      ...record,
    });
    dispatch(changeVisibleDrawer(true));
  };
  const onFinishFilter = values => {
    setFilter(values.role_id.join('-'));
    if (values && values.searchQuery?.length) {
      dispatch(changeSearchQuery(values.searchQuery));
    } else {
      dispatch(changeSearchQuery(''));
    }
  };
  const fetchData = async () => {
    setLoadingTable(true);
    try {
      const data = await settingUserApi.getAll(USER_URL, {
        key: searchQuery,
        limit: pageSize,
        page: current,
        orderby: sorter,
        role_id: filter,
      });
      if (data.data.status === 'success') {
        setDataTable(data.data.data);
        setTotal(data.data.total);
        setLoadingTable(false);
      }
    } catch (e) {
      setLoadingTable(false);
      message.error(e.message);
    }
  };

  const deleteUser = async record => {
    try {
      const res = await settingUserApi.deleteData(USER_URL, record.username);
      if (res.data.status === 'success') {
        dispatch(setReloadTable());
        message.success(t(`user.${messageAction.deleteSuccess}`));
      } else {
        message.warn(t(`user.${messageAction.deleteFail}`));
      }
    } catch (e) {
      message.error(t(`user.${messageAction.deleteFail}`));
    }
  };

  const fetchRoleActive = async () => {
    try {
      const res = await settingUserApi.getAll(ROLE_URL, {
        status: 1,
        limit: 0,
      });
      setRoleActiveApi(res.data.data);
    } catch (e) {
      message.error(t(`user.${messageAction.installErr}`));
    }
  };
  useEffect(() => {
    let unmount = false;
    if (!unmount) {
      fetchRoleActive();
    }
    return () => {
      unmount = true;
    };
  }, []);

  //useEff

  useEffect(() => {
    let unmount = false;
    if (!unmount) {
      setLoadingTable(true);
      fetchData();
    }
    return () => {
      unmount = true;
    };
  }, [searchQuery, reloadTable, sorter, current, pageSize, filter]);
  return (
    <div className="user-setting__body">
      <SearchForm
        roleApi={roleActiveApi}
        onFinishFilter={onFinishFilter}
        filterOption={t('user.role_id')}
      />
      <TableUser
        data={dataTable}
        columns={columns}
        setTotal={setTotal}
        setCurrent={setCurrent}
        setPageSize={setPageSize}
        pageSize={pageSize}
        current={current}
        total={total}
        loading={loadingTable}
        setColumns={setColumn}
      />
      <UserDrawer
        visible={visibleDrawer}
        roleApi={roleActiveApi}
        setFilter={setFilter}
        form={form}
      />
    </div>
  );
};
function confirm(config) {
  Modal.confirm(config);
}
// props.deleteUser(props.record);
const Content = props => (
  <div className="user__action">
    <span
      onClick={e => {
        props.showDrawerEdit(props.record);
      }}
      className="pointer btn"
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
          content: props.record.username,
          okText: props.t('user.yes'),
          cancelText: props.t('user.no'),
          onOk: () => {
            props.deleteUser(props.record);
          },
        });
      }}
    >
      <img src={del} alt="icon" className="pr-10" />
      {props.t(`user.${messageAction.delete}`)}
    </span>
  </div>
);

export default React.memo(UserBody);
