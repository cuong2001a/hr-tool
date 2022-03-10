import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Drawer, Radio, Select, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeVisibleDrawer,
  setReloadTable,
} from '../../commonSlice/userSlice';
import { EditFilled, PlusCircleFilled } from '@ant-design/icons';
import { FORM_FIELD, STATUS_FIELD } from './constant';
import { settingUserApi } from '../../../../api/settingUserApi';
import { USER_URL } from '../../../../constants/api';
import { useTranslation } from 'react-i18next';
import { messageAction } from '../userBody/constant';
/**
 * @author
 * @function UserModal
 **/

const { Option } = Select;

export const UserDrawer = props => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { edit } = useSelector(state => state.user);
  const onClose = () => {
    dispatch(changeVisibleDrawer(false));
  };
  const [loading, setLoading] = useState(false);
  const handleOk = () => {
    setLoading(true);
    submitBtn.current.click();
  };

  const onFinishFailed = () => {
    setLoading(false);
  };

  useEffect(() => {
    if (!edit) {
      props.form.setFieldsValue({
        username: '',
        fullname: '',
        email: '',
        role_id: null,
        status: 1,
      });
    }
  }, [edit]);
  const onFinish = async values => {
    try {
      if (edit) {
        const res = await settingUserApi.updateData(
          USER_URL,
          values.username,
          values,
        );
        if (res.data?.status === 'success') {
          dispatch(changeVisibleDrawer(false));
          props.form.setFieldsValue({
            username: '',
            fullname: '',
            email: '',
            role_id: null,
            status: 1,
          });
          message.success(t(`user.${messageAction.updateSuccess}`));
          setLoading(false);
          dispatch(setReloadTable());
        } else if (res.data?.code === 'dberror') {
          message.warn(t(`user.${messageAction.createWarn}`));
          setLoading(false);
        } else {
          setLoading(false);
          message.warn(t(`user.${messageAction.createWarn}`));
        }
      } else {
        const res = await settingUserApi.addNew(USER_URL, values);
        if (res.data?.status === 'success') {
          dispatch(changeVisibleDrawer(false));
          props.form.setFieldsValue({
            username: '',
            fullname: '',
            email: '',
            role_id: null,
            status: 1,
          });
          message.success(t(`user.${messageAction.createSuccess}`));
          setLoading(false);
          dispatch(setReloadTable());
        } else if (res.data?.code === 'dberror') {
          message.warn(t(`user.${messageAction.createWarn}`));
          setLoading(false);
        } else {
          setLoading(false);
          message.warn(t(`user.${messageAction.createWarn}`));
        }
      }
    } catch (e) {
      message.error(e.message);
      setLoading(false);
    }
  };
  const submitBtn = useRef();
  return (
    <>
      <Drawer
        title={edit ? t('user.modalLabelEdit') : t('user.titleModalAdd')}
        placement="right"
        onClose={onClose}
        visible={props.visible}
        className="drawer-add"
        footer={[
          <Button
            key="submit"
            type="primary"
            icon={edit ? <EditFilled /> : <PlusCircleFilled />}
            loading={loading}
            onClick={handleOk}
          >
            {edit ? t('user.edit') : t('user.create')}
          </Button>,
        ]}
      >
        <Form
          form={props.form}
          name="control-hooks"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout={'vertical'}
        >
          {FORM_FIELD.map((e, i) => {
            return (
              <Form.Item
                key={i}
                name={e.name}
                label={
                  <>
                    {t(`user.${e.name}`)} <RequireMark />{' '}
                  </>
                }
                rules={e.rule}
                hidden={e.hidden}
              >
                <Input placeholder={t(`user.${e.placehoder}`)} />
              </Form.Item>
            );
          })}
          <Form.Item
            name="role_id"
            label={
              <>
                {t(`user.role_id`)} <RequireMark />
              </>
            }
            rules={[
              {
                required: true,
                message:
                  t(`user.${messageAction.validateRequireMessage}`) +
                  ' ' +
                  t('user.role_id'),
              },
            ]}
          >
            <Select placeholder={t('user.dropdownplace')}>
              {props.roleApi &&
                props.roleApi.map(e => (
                  <Option key={e.id} value={e.id}>
                    {e.title}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label={t('user.statusLabelModal')}
            rules={[
              {
                required: true,
              },
            ]}
            initialValue={1}
          >
            <Radio.Group>
              {STATUS_FIELD.map((e, i) => (
                <Radio value={i} key={i}>
                  {e}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              hidden={true}
              ref={submitBtn}
            ></Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export const RequireMark = props => (
  <>
    <span style={{ marginLeft: '4px' }}>(</span>{' '}
    <span style={{ color: '#ff4d4f' }}>*</span> <span>)</span>{' '}
  </>
);
