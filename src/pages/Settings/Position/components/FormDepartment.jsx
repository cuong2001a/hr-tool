import { PlusCircleFilled } from '@ant-design/icons';
import { Button, Drawer, Form, Input, message, Radio } from 'antd';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { positionApi } from '../../../../api/positionApi';
import { setReloadTalbe, showFormDepartment } from '../reducer';
function FormDepartment(props) {
  const { visibleFormDepartment } = useSelector(item => item.position);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const onClose = () => {
    dispatch(showFormDepartment(false));
  };
  const handleFormSubmit = async value => {
    try {
      const res = await positionApi.postPosition(value);
      console.log(res);
      dispatch(setReloadTalbe());
      dispatch(showFormDepartment(false));
      message.success(t('position.successEdi'));
    } catch (error) {
      console.log(error);
    }
  };
  const submitBtn = useRef();
  return (
    <div className="position__form">
      <Drawer
        title={t('position.createDepartment')}
        placement="right"
        onClose={onClose}
        visible={visibleFormDepartment}
        bodyStyle={{ padding: '16px 29px 0px 22px' }}
        footerStyle={{ border: 'none', padding: '21px 17px' }}
        footer={
          <Button
            icon={<PlusCircleFilled />}
            color="white"
            type="primary"
            htmlType="submit"
            onClick={() => submitBtn.current.click()}
          >
            {t('position.create')}
          </Button>
        }
      >
        <Form
          initialValues={{ status: 1 }}
          layout="vertical"
          form={form}
          onFinish={handleFormSubmit}
        >
          <Form.Item
            name="title"
            label={
              <span>
                <span style={{ marginRight: '5px' }}>{`${t(
                  'position.title',
                )}`}</span>
                (<span style={{ color: '#ff4d4f', fontSize: '14px' }}>*</span>)
              </span>
            }
            rules={[
              {
                required: true,
                message: t('position.errorRequired'),
              },
              {
                min: 3,
                message: t('position.errorMinLength'),
              },
              {
                max: 200,
                message: t('position.errorMaxLengthTitle'),
              },
            ]}
          >
            <Input placeholder="Sales" style={{ width: '100%' }} s />
          </Form.Item>
          <Form.Item name="description" label={t('position.description')}>
            <Input.TextArea showCount maxLength={1000} />
          </Form.Item>
          <Form.Item name="status" label={t('position.status')}>
            <Radio.Group>
              <Radio value={0}>{t('position.lock')}</Radio>
              <Radio value={1}>{t('position.unlock')}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button
              icon={<PlusCircleFilled />}
              color="white"
              type="primary"
              htmlType="submit"
              ref={submitBtn}
              hidden={true}
            >
              {t('position.create')}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default FormDepartment;
