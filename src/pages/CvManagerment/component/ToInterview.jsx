import { Form, Input, Select, Button, DatePicker, message } from 'antd';
import React, { memo, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import toInterviewApi from '../../../api/toInterviewApi';
import { CONDITION_NAME_FROM_BACKEND } from '../../../constants/toInterview';
import { useTranslation } from 'react-i18next';
const { Option } = Select;

const ToInterview = memo(({ setVisible }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { id } = useParams();

  // get data to fill from
  useEffect(async () => {
    try {
      const data = await toInterviewApi.getById(id);
      const item = data.data.data;
      form.setFieldsValue({
        time: item?.appoint_date ? moment.unix(item.appoint_date) : '',
        location: item?.appoint_place || '',
        link: item?.appoint_link || '',
        method: item?.appoint_link ? 'online' : 'offline',
      });
    } catch (e) {
      message.error(t('tointerview.errorGet'));
    }
  }, []);

  const onFinish = async values => {
    console.log(values);
    try {
      const item = {
        cv_id: id,
        appoint_date: values.time.unix(),
        appoint_place: values.location,
      };
      console.log(item);
      if (values.method === 'online') item.appoint_link = values.link;
      else item.appoint_link = '';
      const data = await toInterviewApi.post(item);
      if (data.data.message?.includes(CONDITION_NAME_FROM_BACKEND))
        message.error(t('tointerview.errorPass'));
      else {
        message.success(t('tointerview.editSuccess'));
        setVisible(0);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onChangeMethod = value => {
    form.setFieldsValue({ ...form.getFieldsValue(), method: value });
  };

  const shouldUpdateInput = (prevValues, currentValues) =>
    prevValues.method !== currentValues.method;

  return (
    <div className="to-interview">
      <Form
        form={form}
        onFinish={onFinish}
        name="basic-form"
        layout="vertical"
        className="to-interview__form"
      >
        <div>
          <Form.Item
            name="method"
            label={t('tointerview.method')}
            style={{ width: '100%' }}
            required
          >
            <Select onChange={onChangeMethod}>
              <Option value="online">Online</Option>
              <Option value="offline">Offline</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={t('tointerview.time')}
            required
            name="time"
            rules={[
              {
                validator(_, value) {
                  if (value) {
                    if (value.isAfter(moment())) return Promise.resolve();
                    else
                      return Promise.reject(
                        new Error(t('tointerview.futureTime')),
                      );
                  } else return Promise.reject(t('tointerview.requiredTime'));
                },
              },
            ]}
          >
            <DatePicker
              allowClear={false}
              dropdownClassName="time"
              style={{ width: '100%' }}
              format="HH:mm - DD MMM YY"
              showTime={{ format: 'HH:mm' }}
            />
          </Form.Item>

          <Form.Item
            name="location"
            label={t('tointerview.location')}
            required
            rules={[
              { required: true, message: t('tointerview.requiredLocation') },
              { min: 3, message: t('tointerview.minLocation') },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item noStyle shouldUpdate={shouldUpdateInput}>
            {() => {
              return (
                form.getFieldValue('method') === 'online' && (
                  <Form.Item
                    name="link"
                    label={t('tointerview.link')}
                    required
                    rules={[
                      {
                        required: true,
                        message: t('tointerview.requiredLink'),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                )
              );
            }}
          </Form.Item>
        </div>
        <Form.Item className="submit-btn">
          <Button type="primary" htmlType="submit">
            {t('tointerview.submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});

export default ToInterview;
