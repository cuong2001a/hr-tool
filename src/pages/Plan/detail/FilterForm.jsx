import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row, Select } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import qs from 'query-string';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import dashboardApi from '../../../api/dashboardApi';
import planApi from '../../../api/planApi';
import { priorityList, PRIORITY_LIST } from '../../../constants';
import convertParamsToDefault from '../../../utils/convertParams.js';
import { setListLevel, setListUser } from '../reducer/plan-reducer';
function FilterForm(props) {
  const [form] = Form.useForm();
  const { filterDetail, setFilterDetail } = props;
  const { Option, OptGroup } = Select;
  const { t, i18n } = useTranslation();
  const [listFilter, setListFilter] = useState([]);
  const dispatch = useDispatch();
  const listLevel = useSelector(state => state.detailParams.listLevel);
  const listUser = useSelector(state => state.detailParams.listUser);
  const location = useLocation();
  const onFinish = value => {
    const newFilter = {};
    for (var key in value) {
      if (!value[key]) {
        delete value[key];
      } else if (value[key].length === 1) {
        newFilter[key] = value[key].toString();
      } else if (typeof value[key] === 'string') {
        newFilter[key] = value[key];
      } else {
        newFilter[key] = value[key] ? value[key].join('-') : '';
      }
    }
    setFilterDetail(newFilter);
  };

  useEffect(() => {
    const queryParams = qs.parse(location.search);
    const newQueryParams = {};
    newQueryParams['position_id'] = convertParamsToDefault(
      queryParams['position_id'],
      'number',
    );
    newQueryParams['requestor_id'] = convertParamsToDefault(
      queryParams['requestor_id'],
      'string',
    );
    newQueryParams['level_id'] = convertParamsToDefault(
      queryParams['level_id'],
      'number',
    );
    newQueryParams['priority'] = convertParamsToDefault(
      queryParams['priority'],
      'number',
    );
    newQueryParams['assignee_id'] = convertParamsToDefault(
      queryParams['assignee_id'],
      'string',
    );
    newQueryParams['keyword'] = queryParams['keyword'];
    form.setFieldsValue(newQueryParams);
  }, [location, filterDetail]);
  const fetchFilter = async () => {
    try {
      const params = { limit: 0 };
      const resp = await dashboardApi.getFilterPositions(params);
      const list = resp.data.data;
      setListFilter(list);
    } catch (e) {
      message.error(e);
    }
  };
  const fetchLevelFilter = async () => {
    try {
      const params = { limit: 0 };
      const resp = await dashboardApi.getLevelFilter(params);
      const level = resp.data.data;
      dispatch(setListLevel(level));
    } catch (e) {
      message.error(e);
    }
  };

  const fetchUsers = async () => {
    try {
      const params = { limit: 0 };
      const resp = await planApi.getUserFilter(params);
      dispatch(setListUser(resp.data.data));
    } catch (e) {
      message.error(e);
    }
  };

  useEffect(() => {
    fetchFilter();
    fetchLevelFilter();
    fetchUsers();
  }, []);
  const groups = listFilter.reduce((groups, item) => {
    const group = groups[item.parent_title] || [];
    group.push(item);
    groups[item.parent_title] = group;
    return groups;
  }, {});
  const selectProps = {
    mode: 'multiple',
    style: {
      width: '100%',
    },

    maxTagCount: 'responsive',
  };
  const levelFilter = listLevel.filter(item => item.author_id === 'namng');
  return (
    <Form form={form} onFinish={onFinish} className="plan__header--filter">
      <Row gutter={{ md: 8, lg: 16 }}>
        <Col span={6}>
          <FormItem
            name="position_id"
            label={t('plan.position')}
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
            name="requestor_id"
            label={t('plan.requestor')}
            labelCol={{ span: 24 }}
          >
            <Select
              mode="multiple"
              maxTagCount="responsive"
              placeholder={t('statistic.select_item')}
              showArrow
            >
              {listUser.map((item, id) => (
                <Option key={id} value={item.username}>
                  {item.username}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem
            name="level_id"
            label={t('plan.level')}
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
      </Row>
      <Row align="bottom" gutter={{ md: 8, lg: 16 }}>
        <Col span={6}>
          <FormItem
            name="priority"
            label={t('plan.priority')}
            labelCol={{ span: 24 }}
          >
            <Select
              mode="multiple"
              maxTagCount="responsive"
              placeholder={t('statistic.select_item')}
              showArrow
            >
              {PRIORITY_LIST.map(item => (
                <Option key={item.id} value={item.title}>
                  {item.title}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem
            name="assignee_id"
            label={t('plan.assignee')}
            labelCol={{ span: 24 }}
          >
            <Select
              mode="multiple"
              maxTagCount="responsive"
              placeholder={t('statistic.select_item')}
              showArrow
            >
              {listUser.map((item, id) => (
                <Option key={id} value={item.username}>
                  {item.username}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem
            name="keyword"
            label={t('plan.key')}
            labelCol={{ span: 24 }}
          >
            <Input placeholder={t('plan.enter_key')} />
          </FormItem>
        </Col>
        <FormItem labelCol={{ span: 24 }}>
          <Button htmlType="submit" type="primary">
            <SearchOutlined />
          </Button>
        </FormItem>
      </Row>
    </Form>
  );
}

export default FilterForm;
