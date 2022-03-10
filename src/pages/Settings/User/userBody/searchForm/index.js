import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './searchForm.scss';

/**
 * @author
 * @function SearchFormUser
 **/

const SearchForm = props => {
  const { Option } = Select;
  const { t } = useTranslation();
  return (
    <>
      <Form
        name="search"
        onFinish={props.onFinishFilter && props.onFinishFilter}
        autoComplete="off"
        layout="inline"
        className="flex-nowrap d-flex form-mobile"
      >
        {props.filterOption && (
          <div>
            <span className="search__label">
              {props.filterOption ? props.filterOption : ''}
            </span>
            <Form.Item
              name="role_id"
              className="search__form-items filter-role"
            >
              <Select
                mode="multiple"
                allowClear
                showArrow
                placeholder={t('user.all')}
                maxTagCount="responsive"
              >
                {props.roleApi &&
                  props.roleApi.map(e => (
                    <Option value={e.id} key={e.id}>
                      {e.title}
                    </Option>
                  ))}
                {props.permissionApi &&
                  props.permissionApi.map(e => (
                    <Option value={e.alias} key={e.id}>
                      {e.title}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </div>
        )}

        <div>
          <span className="search__label">{t('user.keyword')}</span>
          <Form.Item name="searchQuery" className="search__form-items">
            <Input className="height-40" placeholder={t('user.inputField')} />
          </Form.Item>
        </div>
        <Form.Item className="margin-0 button-form">
          <Button
            className="width-40 height-40"
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
          ></Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default React.memo(SearchForm);
