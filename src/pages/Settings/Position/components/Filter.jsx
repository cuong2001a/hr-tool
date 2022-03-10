import { SearchOutlined } from '@ant-design/icons';
import { Col, Row, Select, Input, Form, Button } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { getResultSearch, setTotalPosition } from '../reducer';
import { positionApi } from '../../../../api/positionApi';
function PositionFilter(props) {
  const { department, requestor, manager } = useSelector(item => item.position);
  const { listParams, onChangeListParams } = props;
  const { Option } = Select;
  const { Search } = Input;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  const onFinish = async value => {
    try {
      const params = {
        ...listParams,
        page: 1,
        parent_id: value.parent_id ? value.parent_id.join('-') : '',
        manager_id: value.manager_id ? value.manager_id.join('-') : '',
        requestor: value.requestor ? value.requestor.join('-') : '',
        title: value.title ? value.title : '',
      };
      console.log('finish', params);
      const { data } = await positionApi.getAllPosition(params);
      console.log(data);
      dispatch(getResultSearch(data.data));
      dispatch(setTotalPosition(data.total));
      onChangeListParams(params);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const queryParams = queryString.parse(location.search);
    const data = {};
    Object.keys(queryParams).map(item => {
      const value = queryParams[item];
      if (item === 'parent_id' && !value.includes('-')) {
        data[item] = Number(value);
      } else if (!value.includes('-') && value) {
        data[item] = [value];
      } else if (!value) {
        data[item] = [];
      } else if (item === 'parent_id') {
        data[item] = value.split('-').map(item => +item);
      } else if (item === 'title') {
        data[item] = value.toString();
      } else {
        data[item] = value.split('-');
      }
    });
    if (data) {
      form.setFieldsValue(data);
    }
    form.setFieldsValue();
  }, [location]);

  return (
    <div className="position__filter">
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={[12, 0]}>
          <Col className="gutter-row" span={6}>
            <Form.Item
              label={t('position.department')}
              name="parent_id"
              style={{
                marginBottom: '13px',
              }}
            >
              <Select
                mode="multiple"
                showArrow
                allowClear
                maxTagCount="responsive"
                placeholder={t('position.placeholderSelect')}
                style={{ width: '100%' }}
              >
                {department?.map((item, index) => {
                  return (
                    <Option key={index} value={item.parent_id ?? ''}>
                      {item.parent_title}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item
              label={t('position.manager')}
              name="manager_id"
              style={{ marginBottom: '13px' }}
            >
              <Select
                mode="multiple"
                showArrow
                allowClear
                maxTagCount="responsive"
                placeholder={t('position.placeholderSelect')}
                style={{ width: '100%' }}
              >
                {manager?.map((item, index) => {
                  return (
                    <Option key={index} value={item}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item
              label={t('position.requestor')}
              name="requestor"
              style={{ marginBottom: '13px' }}
            >
              <Select
                mode="multiple"
                showArrow
                allowClear
                maxTagCount="responsive"
                placeholder={t('position.placeholderSelect')}
                style={{ width: '100%' }}
              >
                {requestor?.map((item, index) => {
                  return (
                    <Option key={index} value={item}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={5}>
            <Form.Item
              name="title"
              label={t('position.key')}
              style={{ marginBottom: '13px' }}
            >
              <Input placeholder={t('position.placeholderInput')} />
            </Form.Item>
          </Col>
          <Col
            className="gutter-row"
            style={{ display: 'flex', alignItems: 'end' }}
            span={1}
          >
            <Form.Item style={{ marginBottom: '13px' }}>
              <Button
                htmlType="submit"
                type="primary"
                style={{
                  width: '40px',
                  height: '42px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <SearchOutlined />
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default PositionFilter;
