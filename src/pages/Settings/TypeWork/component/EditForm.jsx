import { Button, Drawer, Input, Radio, Form } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_STATUS, LIST_STATUS } from '../../../../constants';
import typeworkApi from '../../../../api/typeworkApi';
import { PlusCircleFilled } from '@ant-design/icons';

export default function EditForm({
  formInterface,
  isFormShowed,
  setIsFormShowed,
  fetchApi,
  initialForm,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      title: initialForm.title || '',
      description: initialForm.description || '',
      status: initialForm.status ?? DEFAULT_STATUS,
    });
  }, [isFormShowed]);

  const handleSubmit = async values => {
    if (formInterface.btn === t('typework.createFormBtn')) {
      await typeworkApi.create(values);
    } else {
      await typeworkApi.edit(initialForm.id, values);
    }
    fetchApi();
    setIsFormShowed(false);
  };

  return (
    <Drawer
      title={formInterface.title}
      placement="right"
      onClose={() => setIsFormShowed(false)}
      visible={isFormShowed}
      zIndex={2000}
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
            rules={[
              { min: 3, message: t('typework.titleMinLength') },
              { required: true, message: t('typework.titleRequired') },
            ]}
          >
            <Input placeholder={t('typework.titlePlaceholder')} />
          </Form.Item>
          <Form.Item name="description" label={t('typework.descriptionColumn')}>
            <Input.TextArea
              rows={4}
              placeholder={t('typework.descriptionPlaceholder')}
            />
          </Form.Item>
          <Form.Item name="status" label={t('typework.statusColumn')}>
            <Radio.Group>
              {LIST_STATUS.map(status => (
                <Radio key={status.id} value={status.value}>
                  {t(`typework.${status.title}`)}
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
