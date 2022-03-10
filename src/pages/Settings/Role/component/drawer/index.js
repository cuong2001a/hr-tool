import { EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Button, Checkbox, Drawer, Form, Input, message, Radio } from 'antd';
import React, { useRef, useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { settingUserApi } from '../../../../../api/settingUserApi';
import { ROLE_URL } from '../../../../../constants/api';
import { setReloadTable } from '../../../commonSlice/userSlice';
import { RequireMark } from '../../../User/userModal/index';
import { STATUS_OPTION } from './constant';
import './drawer.scss';
/**
 * @author
 * @function DrawerAddRole
 **/

export const DrawerAddRole = props => {
  const { permissionApi, checkList, setCheckList, isEdit, form } = props;
  const [check, setCheck] = useState({});
  const [checkAllOption, setCheckAllOption] = useState([]);
  const submitBtn = useRef();
  const dispatch = useDispatch();
  // parse checklist to opject
  useEffect(() => {
    const permission = {};
    checkList.map(e => {
      let arr = e.split('.');
      let key = arr[0];
      let value = arr[1];
      permission[key] = { ...permission[key], [value]: true };
    });
    setCheck(permission);
  }, [checkList]);
  // parse All option
  useEffect(() => {
    permissionApi.map(e => {
      const action = JSON.parse(e.action);
      action.map(element => {
        setCheckAllOption(prev => [...prev, `${e.alias}.${element}`]);
      });
    });
  }, [permissionApi]);
  const { t } = useTranslation();
  const onCloseDrawer = () => {
    props.closeDrawer(false);
    setCheckList([]);
    form.setFieldsValue({
      title: '',
      status: 1,
    });
  };
  const onCheckChange = val => {
    setCheckList(val);
  };

  const onSubmitForm = async val => {
    try {
      if (check) {
        if (!isEdit) {
          const res = await settingUserApi.addNew(ROLE_URL, {
            ...val,
            permission: check,
          });
          if (res.data.status === 'success') {
            props.closeDrawer(false);
            setCheckList([]);
            form.setFieldsValue({
              title: '',
              status: 1,
            });
            dispatch(setReloadTable());
            message.success(t('role.addRoleSuccess'));
          }
        } else {
          const res = await settingUserApi.updateData(ROLE_URL, val.id, {
            ...val,
            permission: check,
          });
          if (res.data.status === 'success') {
            props.closeDrawer(false);
            setCheckList([]);
            form.setFieldsValue({
              title: '',
              status: 1,
            });
            message.success(t('role.editRoleSuccess'));
            dispatch(setReloadTable());
          }
        }
      }
    } catch (err) {
      message.error(err.message);
    }
  };
  const checkAllChange = e => {
    setCheckList(e.target.checked ? checkAllOption : []);
  };
  return (
    <>
      <Drawer
        title={isEdit ? t('role.titleModalEdit') : t('role.titleModalAdd')}
        placement="right"
        visible={props.visible}
        onClose={onCloseDrawer}
        className="drawer-add add-role"
        footer={[
          <Button
            key="submit"
            type="primary"
            icon={isEdit ? <EditOutlined /> : <PlusCircleFilled />}
            onClick={() => {
              submitBtn.current.click();
            }}
          >
            {isEdit ? t('user.edit') : t('user.create')}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={onSubmitForm}>
          <Form.Item
            name={'title'}
            label={
              <>
                {t('role.role')} <RequireMark />{' '}
              </>
            }
            rules={[
              { required: true },
              {
                validator: (_, val) => {
                  let message = t('role.requireTitle');
                  let check = false;
                  if (val?.length >= 3 && val?.length < 200) {
                    check = true;
                    message = '';
                  }
                  return check
                    ? Promise.resolve(message)
                    : Promise.reject(message);
                },
              },
            ]}
          >
            <Input placeholder={t('user.roleplace')} />
          </Form.Item>
          <Form.Item name={'id'} hidden>
            <Input />
          </Form.Item>
          <p className="role-permission__label">{t('role.permission')}</p>
          <div className="permission-box">
            <Checkbox onChange={checkAllChange}>{t('role.checkAll')}</Checkbox>
            <Checkbox.Group onChange={onCheckChange} value={checkList}>
              <table>
                <thead>
                  <tr>
                    <th className="thead-title"></th>
                    <th>{t('role.view')}</th>
                    <th>{t('role.add')}</th>
                    <th>{t('role.edit')}</th>
                    <th>{t('role.delete')}</th>
                    <th>{t('role.decision')}</th>
                  </tr>
                </thead>
                <tbody>
                  {permissionApi &&
                    permissionApi.map(e => {
                      let action = JSON.parse(e.action);
                      return (
                        <tr key={e.id}>
                          <td className="text-left">{e.title}</td>
                          <td>
                            {action.includes('view') ? (
                              <Checkbox value={`${e.alias}.view`} />
                            ) : (
                              ''
                            )}
                          </td>
                          <td>
                            {action.includes('add') ? (
                              <Checkbox value={`${e.alias}.add`} />
                            ) : (
                              ''
                            )}
                          </td>
                          <td>
                            {action.includes('edit') ? (
                              <Checkbox value={`${e.alias}.edit`} />
                            ) : (
                              ''
                            )}
                          </td>
                          <td>
                            {action.includes('delete') ? (
                              <Checkbox value={`${e.alias}.delete`} />
                            ) : (
                              ''
                            )}
                          </td>
                          <td>
                            {action.includes('decision') ? (
                              <Checkbox value={`${e.alias}.decision`} />
                            ) : (
                              ''
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </Checkbox.Group>
          </div>
          <Form.Item name="status" label={t('user.status')} initialValue={1}>
            <Radio.Group>
              {STATUS_OPTION.map(e => (
                <Radio value={e.value} key={e.value}>
                  {e.title}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" ref={submitBtn} hidden>
              subnit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
