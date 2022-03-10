import { SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

function FilterFormGeneral(props) {
  const { filter, setFilter } = props;
  const dispatch = useDispatch();
  const location = useLocation();
  const navi = useNavigate();
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();
  const { RangePicker } = DatePicker;
  const monthFormat = 'MM/YYYY';
  const onFinish = value => {
    console.log(value);
  };

  return (
    <Form form={form} onFinish={onFinish} className="plan__header--filter">
      <Row align="bottom">
        <FormItem
          name="group"
          label={t('plan.period')}
          labelCol={{ span: 24 }}
          style={{ width: '262px' }}
          rules={[{ required: true, message: 'Please choose this!' }]}
        >
          <RangePicker
            picker="month"
            format={monthFormat}
            placeholder={[t('plan.from'), t('plan.to')]}
          />
        </FormItem>
        <FormItem>
          <Button htmlType="submit" type="primary">
            <SearchOutlined />
          </Button>
        </FormItem>
      </Row>
    </Form>
  );
}

export default FilterFormGeneral;
