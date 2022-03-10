import { Drawer, Form, Input, Button, Radio } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import sourceApi from '../../../api/sourceApi';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { LIST_STATUS, DEFAULT_STATUS } from '../../../constants/settingSource';
import { PlusCircleFilled } from '@ant-design/icons/lib/icons';

export default function EditForm({ setIsFormShowed, initialForm, fetchApi }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isFormShowed, formInterface] = useSelector(state => [
    state.source.isFormShowed,
    state.source.formInterface,
  ]);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      title: initialForm.title || '',
      description: initialForm.description || '',
      status: initialForm.status ?? DEFAULT_STATUS,
    });
  }, [isFormShowed]);

  const handleSubmit = async values => {
    if (formInterface.btn === t('source.createBtn')) {
      await sourceApi.post(values);
    } else {
      await sourceApi.put(initialForm.id, values);
    }
    fetchApi();
    dispatch(setIsFormShowed(false));
  };

  return (
    <Drawer
      title={formInterface.title}
      placement="right"
      onClose={() => dispatch(setIsFormShowed(false))}
      visible={isFormShowed}
      zIndex={2000}
      className="drawer-form"
      getContainer={false}
    >
      <Form
        form={form}
        name="nest-messages"
        layout="vertical"
        className="d-flex"
        onFinish={handleSubmit}
        style={{ flexDirection: 'column', height: '100%' }}
      >
        <div>
          <Form.Item
            name="title"
            label={
              <span className="field--required">
                {`${t('typework.title')}`} (<span>*</span>)
              </span>
            }
            required
            rules={[
              { min: 3, message: t('typework.titleMinLength') },
              { required: true, message: t('typework.titleRequired') },
            ]}
          >
            <Input placeholder={t('source.titlePlaceholder')} />
          </Form.Item>
          <Form.Item name="description" label={t('source.descriptionColumn')}>
            <Input.TextArea
              rows={4}
              placeholder={t('typework.descriptionPlaceholder')}
            />
          </Form.Item>
          <Form.Item name="status" label={t('source.statusColumn')}>
            <Radio.Group>
              {LIST_STATUS.map(status => (
                <Radio key={status.id} value={status.value}>
                  {t(`source.${status.title}`)}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </div>

        <Form.Item style={{ marginTop: 'auto', marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" icon={<PlusCircleFilled />}>
            {formInterface.btn}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
