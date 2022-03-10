import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getLevel } from '../../../api/level/levelApi';
import { positionApi } from '../../../api/positionApi';
import { settingUserApi } from '../../../api/settingUserApi';
import { USER_URL } from '../../../constants/api';
import {
  DEFAULT_PRIORITY,
  LIST_REQUEST_STATUS,
  PARAMS_GET_ALL,
} from '../../../constants/requestPage';
import { setReloadTable } from '../requestSlice';

const { Option, OptGroup } = Select;

function SearchForm({ onChangeListParams, listParams }) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [listUser, setListUser] = useState([]);
  const [listLevel, setListLevel] = useState([]);
  const [listPosition, setListPosition] = useState({});
  const isReloadTable = useSelector(state => state.request.isReloadTable);

  useEffect(() => {
    (async () => {
      await Promise.all([
        fetchListLevel(),
        fetchListPosition(),
        fetchListUser(),
      ]);
    })();
  }, []);

  const fetchListLevel = async () => {
    try {
      // call api get list level with status = 1
      const response = await getLevel(PARAMS_GET_ALL);

      setListLevel(
        response.data.data.map(item => ({
          id: item.id,
          title: item.title,
        })),
      );
    } catch (error) {
      message.error(t('request.failToFetchListLevel'));
    }
  };

  const fetchListUser = async () => {
    try {
      const response = await settingUserApi.getAll(USER_URL, PARAMS_GET_ALL);
      setListUser([...new Set(response.data.data.map(item => item.username))]);
    } catch (error) {
      message.error(t('request.failToFetchListLevel'));
    }
  };

  const fetchListPosition = async () => {
    try {
      const response = await positionApi.getAllPosition(PARAMS_GET_ALL);

      const listPos = response.data.data.reduce((groups, item) => {
        if (item.parent_title) {
          const group = groups[item.parent_title] || [];
          group.push(item);
          groups[item.parent_title] = group;
        }
        return groups;
      }, {});

      setListPosition(listPos);
    } catch (error) {
      message.error(t('request.failToFetchListTypeWork'));
    }
  };

  const handleSubmitSearchForm = values => {
    for (const key in values) {
      if (key !== 'keyword') {
        values[key] = values[key].join('-');
      }
    }
    onChangeListParams(prev => ({ ...prev, ...values }));
    dispatch(setReloadTable(!isReloadTable));
  };

  useEffect(() => {
    form.setFieldsValue({
      requestor_id: listParams?.requestor_id
        ? listParams?.requestor_id.split('-')
        : [],
      position_id: listParams?.position_id
        ? listParams?.position_id.split('-').map(item => Number(item))
        : [],
      level_id: listParams?.level_id
        ? listParams?.level_id.split('-').map(item => Number(item))
        : [],
      priority: listParams?.priority
        ? listParams?.priority.split('-').map(item => Number(item))
        : [],
      status: listParams?.status
        ? listParams?.status.split('-').map(item => Number(item))
        : [],
      keyword: listParams?.keyword,
    });
  }, [listParams]);

  return (
    <div className="request__searchForm">
      <Form
        form={form}
        name="search"
        autoComplete="off"
        layout="vertical"
        className="request__searchForm--list"
        onFinish={handleSubmitSearchForm}
      >
        <Row gutter={12} style={{ width: '95%' }}>
          <Col className="searchForm__position" span={4}>
            <span>{t('request.position')}</span>
            <Form.Item name="position_id" className="" labelCol={{ span: 3 }}>
              <Select
                mode="multiple"
                showArrow
                maxTagCount="responsive"
                placeholder={t('request.placeholderForRequestForm')}
              >
                {Object.keys(listPosition).map((key, id) => {
                  return (
                    <OptGroup label={key} value={key} key={id}>
                      {listPosition[key].map(value => (
                        <Option key={value.id} value={value.id}>
                          {value.title}
                        </Option>
                      ))}
                    </OptGroup>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col className="searchForm__requestor" span={4}>
            <span>{t('request.requestor')}</span>
            <Form.Item name="requestor_id" className="" labelCol={{ span: 3 }}>
              <Select
                mode="multiple"
                showArrow
                maxTagCount="responsive"
                placeholder={t('request.placeholderForRequestForm')}
              >
                {listUser.map(req => (
                  <Option key={req} value={req}>
                    {req}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col className="searchForm__level" span={4}>
            <span>{t('request.level')}</span>
            <Form.Item name="level_id" className="" labelCol={{ span: 3 }}>
              <Select
                mode="multiple"
                showArrow
                maxTagCount="responsive"
                placeholder={t('request.placeholderForRequestForm')}
              >
                {listLevel.map(level => (
                  <Option key={level.id} value={level.id}>
                    {level.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col className="searchForm__priority" span={4}>
            <span>{t('request.priority')}</span>
            <Form.Item name="priority" className="" labelCol={{ span: 3 }}>
              <Select
                mode="multiple"
                showArrow
                maxTagCount="responsive"
                placeholder={t('request.placeholderForRequestForm')}
              >
                {DEFAULT_PRIORITY.map(priority => (
                  <Option key={priority.value} value={priority.value}>
                    {priority.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col className="searchForm__status" span={4}>
            <span>{t('request.status')}</span>
            <Form.Item name="status" className="" labelCol={{ span: 3 }}>
              <Select
                mode="multiple"
                showArrow
                maxTagCount="responsive"
                placeholder={t('request.placeholderForRequestForm')}
              >
                {LIST_REQUEST_STATUS.map(req => (
                  <Option key={req.id} value={req.value}>
                    {req.text}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col className="searchForm__searchInput" span={4}>
            <span>{t('request.search')}</span>
            <Form.Item name="keyword" className="" labelCol={{ span: 3 }}>
              <Input placeholder={t('request.requestSearchPlaceholder')} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item className="searchForm__submitBtn">
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />} />
        </Form.Item>
      </Form>
    </div>
  );
}

export default SearchForm;
