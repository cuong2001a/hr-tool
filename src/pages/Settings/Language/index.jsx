import { PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, PageHeader } from 'antd';
import queryString from 'query-string';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import languageApi from '../../../api/languageApi';
import {
  DEFAULT_PAGENUMBER,
  DEFAULT_PAGESIZE,
} from '../../../constants/languagePage';
import { convertArrayToParamsWithDash } from '../../../utils/convertArrayToParamsWithDash';
import { removeAccents } from '../../../utils/removeAccents';
import LanguageForm from './components/LanguageForm';
import ListLanguage from './components/ListLanguage';
import {
  setListLanguage,
  setTotalRecords,
  setVisibleFormLang,
} from './languageSlice';

function Language(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const location = useLocation();
  let unMounted = useRef(false);

  const [valueALang, setValueALang] = useState({});
  const [loadingTable, setLoadingTable] = useState(true);
  const [formTitle, setFormTitle] = useState('');
  const [formBtnTitle, setFormBtnTitle] = useState('');
  const [listParams, setListParams] = useState(() => {
    const searchParam = queryString.parse(location.search, {
      parseNumbers: true,
    });
    return {
      limit: searchParam.limit || DEFAULT_PAGESIZE,
      page: searchParam.page || DEFAULT_PAGENUMBER,
      key: searchParam.key || '',
      orderby: searchParam?.orderby || '',
      status: searchParam?.status ?? '',
    };
  });

  useEffect(() => {
    const newParams = { ...listParams };
    convertArrayToParamsWithDash(newParams);

    navigate({
      pathname: location.pathname,
      search: queryString.stringify(newParams, {
        skipNull: true,
        skipEmptyString: true,
      }),
    });
  }, [listParams]);

  const handleCreateLanguage = () => {
    setValueALang({});
    setFormBtnTitle(t('language.titleBtnCreateLang'));
    setFormTitle(t('language.titleCreateLang'));
    dispatch(setVisibleFormLang(true));
  };

  const handleSubmitSearchForm = async value => {
    try {
      const params = {
        ...listParams,
        key: removeAccents(value.languageSearch),
      };

      const response = await languageApi.getAll(params);
      if (!unMounted.current) {
        dispatch(setListLanguage(response.data.data));
        dispatch(setTotalRecords(response.data.total));
        setListParams(prev => ({
          ...prev,
          key: removeAccents(value.languageSearch),
        }));
      }
    } catch (error) {
      if (!unMounted.current) {
        message.error(t('language.networkError'));
        throw new Error('Fail to search language');
      }
    }
  };

  useEffect(() => {
    if (!unMounted.current) {
      form.setFieldsValue({
        languageSearch: listParams.key ?? '',
      });
    }
    return () => {
      unMounted.current = true;
    };
  }, []);

  return (
    <div className="language">
      <PageHeader
        ghost={false}
        title={t('language.language')}
        extra={[
          <Button key="1" type="primary" onClick={handleCreateLanguage}>
            <PlusCircleFilled />
            <span className="language__addBtn">{t('language.createLang')}</span>
          </Button>,
        ]}
      />
      <LanguageForm
        valueALang={valueALang}
        setValueALang={setValueALang}
        onLoadingTable={setLoadingTable}
        formTitle={formTitle}
        formBtnTitle={formBtnTitle}
      />
      <div className="language__content">
        <span>{t('language.keyword')}</span>
        <Form
          form={form}
          name="search"
          autoComplete="off"
          layout="inline"
          className="language__content--form form"
          onFinish={handleSubmitSearchForm}
        >
          <Form.Item
            name="languageSearch"
            className="form__input"
            style={{ flexBasis: '550px', marginRight: '12px' }}
          >
            <Input placeholder={t('language.languageSearchPlaceholder')} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
            />
          </Form.Item>
        </Form>
      </div>
      <ListLanguage
        setValueALang={setValueALang}
        onLoadingTable={setLoadingTable}
        onChangeFormTitle={setFormTitle}
        onChangeFormBtnTitle={setFormBtnTitle}
        loadingTable={loadingTable}
        onChangeListParams={setListParams}
        listParams={listParams}
      />
    </div>
  );
}

export default Language;
