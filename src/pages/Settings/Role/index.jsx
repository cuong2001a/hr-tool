import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SearchForm from '../User/userBody/searchForm';
import { DrawerAddRole } from './component/drawer';
import { PageHeaderRole } from './component/pageHeader';
import { TableRole } from './component/table';
import { settingUserApi } from '../../../api/settingUserApi';
import { PERMISSION_URL } from '../../../constants/api';
import { Form, message } from 'antd';

function Role(props) {
  const { t } = useTranslation();
  const [visibleDrawerAddRole, setVisibleDrawerAddRole] = useState(false);
  const [permissionApi, setPermissionApi] = useState([]);
  const [filter, setFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [checkList, setCheckList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();

  // func
  const onFinishFilter = values => {
    if (values.role_id) {
      setFilter(values.role_id.join('-'));
    }
    if (values.searchQuery) {
      setKeyword(values.searchQuery);
    }
  };
  // call api
  const fetchPermission = async () => {
    try {
      const res = await settingUserApi.getAll(PERMISSION_URL, {
        status: 1,
        limit: 0,
      });
      setPermissionApi(res.data.data);
    } catch (e) {
      message.error(e.message);
    }
  };

  // useEff
  useEffect(() => {
    let unmount = false;
    if (!unmount) {
      fetchPermission();
    }
    return () => {
      unmount = true;
    };
  }, []);
  return (
    <div>
      <PageHeaderRole
        showDrawerAdd={setVisibleDrawerAddRole}
        setIsEdit={setIsEdit}
      />
      <DrawerAddRole
        visible={visibleDrawerAddRole}
        closeDrawer={setVisibleDrawerAddRole}
        permissionApi={permissionApi}
        checkList={checkList}
        setCheckList={setCheckList}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        form={form}
      />
      <div className="user-setting__body">
        <SearchForm
          permissionApi={permissionApi}
          onFinishFilter={onFinishFilter}
        />
        <TableRole
          checkList={checkList}
          setCheckList={setCheckList}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          filter={filter}
          keyword={keyword}
          setVisibleDrawerAddRole={setVisibleDrawerAddRole}
          form={form}
        />
      </div>
    </div>
  );
}

export default Role;
