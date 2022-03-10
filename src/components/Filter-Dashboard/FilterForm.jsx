import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, message, Row, Select } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import dashboardApi from '../../api/dashboardApi';
function FilterForm({ setFilter, filter }) {
  const navi = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { Option, OptGroup } = Select;
  const [listFilter, setListFilter] = useState([]);
  const [listLevelFilter, setListLevelFilter] = useState([]);
  const { t, i18n } = useTranslation();
  const monthFormat = 'MM/YYYY';
  const onFinish = value => {
    const newVal = {};
    for (var key in value) {
      if (key === 'date') {
        newVal['month'] = (moment(value.date).month() + 1).toString();
        newVal['year'] = moment(value.date).year().toString();
      } else if (!value[key]) {
        delete value[key];
      } else if (value[key].length === 1) {
        newVal[key] = value[key].toString();
      } else {
        newVal[key] = value[key] ? value[key].join('-') : '';
      }
    }
    setFilter(newVal);
  };
  useEffect(() => {
    navi({
      pathname: location.pathname,
      search: queryString.stringify(filter),
    });
  }, [filter]);
  useEffect(() => {
    const queryParams = queryString.parse(location.search);
    const newQueryParams = {};
    Object.keys(queryParams).map(key => {
      const value = queryParams[key];
      if (key === 'month' || key === 'year') {
        newQueryParams['date'] = moment(
          `${queryParams['year']}/${queryParams['month']}`,
          'YYYY/MM',
        );
      } else if (!value.includes('-') && value) {
        newQueryParams[key] = [Number(value)];
      } else if (!value) {
        newQueryParams[key] = [];
      } else {
        newQueryParams[key] = value.split('-').map(item => +item);
      }
    });
    form.setFieldsValue(newQueryParams);
  }, [location, filter]);
  const fetchFilter = async () => {
    try {
      const params = { limit: 100 };
      const resp = await dashboardApi.getFilterPositions(params);
      const list = resp.data.data;
      setListFilter(list);
    } catch (e) {
      message.error(e);
    }
  };
  const levelFilter = listLevelFilter.filter(
    item => item.author_id === 'namng',
  );
  const fetchLevelFilter = async () => {
    try {
      const params = { limit: 100 };
      const resp = await dashboardApi.getLevelFilter(params);
      const level = resp.data.data;
      setListLevelFilter(level);
    } catch (e) {
      message.error(e);
    }
  };
  const selectProps = {
    mode: 'multiple',
    style: {
      width: '100%',
    },

    maxTagCount: 'responsive',
  };
  useEffect(() => {
    fetchFilter();
    fetchLevelFilter();
  }, []);
  const groups = listFilter.reduce((groups, item) => {
    const group = groups[item.parent_title] || [];
    group.push(item);
    groups[item.parent_title] = group;
    return groups;
  }, {});
  return (
    <Form form={form} onFinish={onFinish}>
      <Row align="bottom" gutter={{ md: 8, lg: 16 }}>
        <Col span={6}>
          <FormItem
            name="date"
            label={t('statistic.time')}
            labelCol={{ span: 24 }}
            rules={[{ required: true, message: 'Please choose this!' }]}
          >
            <DatePicker
              picker="month"
              size="middle"
              style={{ width: '346px' }}
              format={monthFormat}
            />
          </FormItem>
        </Col>

        <Col span={6}>
          <FormItem
            name="position"
            label={t('statistic.position')}
            labelCol={{ span: 24 }}
          >
            <Select
              mode="multiple"
              placeholder={t('statistic.select_item')}
              maxTagCount="responsive"
              showArrow
            >
              {Object.keys(groups).map((key, id) => {
                if (key === 'null') {
                  return;
                }
                return (
                  <OptGroup label={key} value={id} key={id}>
                    {groups[key].map(value => (
                      <Option key={value.id} value={value.id}>
                        {value.title}
                      </Option>
                    ))}
                  </OptGroup>
                );
              })}
            </Select>
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem
            name="level"
            label={t('statistic.level')}
            labelCol={{ span: 24 }}
          >
            <Select
              {...selectProps}
              placeholder={t('statistic.select_item')}
              showArrow
            >
              {levelFilter.map((item, id) => (
                <Option key={id} value={item.id}>
                  {item.title}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>

        <FormItem>
          <Button htmlType="submit" type="primary">
            <SearchOutlined />
          </Button>
        </FormItem>
      </Row>
    </Form>
  );
}
export default FilterForm;
