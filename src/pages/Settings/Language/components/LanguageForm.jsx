import { PlusCircleFilled } from '@ant-design/icons';
import { Button, Drawer, Form, Input, message, Radio } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import languageApi from '../../../../api/languageApi';
import {
  DEFAULT_STATUS,
  LIST_STATUS,
  MAX_LENGTH_DESCRIPTION_INPUT,
  RULE_TITLE_LANGUAGE_FORM,
} from '../../../../constants/languagePage';
import { setReloadTable, setVisibleFormLang } from '../languageSlice';

function LanguageForm({
  valueALang,
  setValueALang,
  onLoadingTable,
  formBtnTitle,
  formTitle,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const visibleFormLang = useSelector(
    state => state.filterLang.visibleFormLang,
  );

  const [, forceUpdate] = useState({}); // To disable submit button at the beginning.
  const [hasErrorOnFields, setHasErrorOnFields] = useState(true);

  useEffect(() => {
    forceUpdate({});
  }, []);

  const onClose = () => {
    dispatch(setVisibleFormLang(false));
    setValueALang({});
  };

  const handleCreateLang = async values => {
    try {
      await languageApi.create(values);
      dispatch(setVisibleFormLang(false));
      dispatch(setReloadTable());
      onLoadingTable(true);
      form.resetFields();
      message.success(t('language.fetchCreateLangSuccess'));
    } catch (error) {
      message.error(t('language.fetchCreateLangFail'));
    }
  };

  const handleEditLanguage = async values => {
    try {
      await languageApi.edit(valueALang.id, values);
      dispatch(setReloadTable());
      message.success(t('language.fetchEditLanguageSuccess'));
      dispatch(setVisibleFormLang(false));
      onLoadingTable(true);
    } catch (error) {
      message.error(t('language.fetchEditLanguageFail'));
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    form.resetFields();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      title: valueALang?.title,
      description: valueALang?.description,
      status: valueALang?.status ?? DEFAULT_STATUS,
    });
  }, [valueALang]);

  const handleChangeFields = (_, allFields) => {
    setHasErrorOnFields(allFields.map(field => field.errors).flat().length);
  };

  useEffect(() => {
    if (formTitle === t('language.titleCreateLang')) {
      setHasErrorOnFields(true);
    } else {
      setHasErrorOnFields(false);
    }
  }, [visibleFormLang]);

  return (
    <>
      <Drawer
        className="language_form"
        visible={visibleFormLang}
        title={formTitle}
        onClose={onClose}
        forceRender
        placement="right"
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          className="language__form"
          onFinish={
            Object.keys(valueALang).length === 0
              ? handleCreateLang
              : handleEditLanguage
          }
          onFieldsChange={handleChangeFields}
        >
          <Form.Item
            name="title"
            label={
              <span>
                {`${t('language.title')}`} (
                <span className="language__title--required"></span>)
              </span>
            }
            hasFeedback
            rules={RULE_TITLE_LANGUAGE_FORM}
          >
            <Input placeholder={t('language.placeholderTitle')} />
          </Form.Item>
          <Form.Item name="description" label={t('language.description')}>
            <TextArea
              rows={4}
              showCount
              maxLength={MAX_LENGTH_DESCRIPTION_INPUT}
              allowClear
              placeholder={t('language.placeholderDescription')}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label={t('language.status')}
            className="collection-create-form_last-form-item"
          >
            <Radio.Group>
              {LIST_STATUS.map(status => (
                <Radio key={status.id} value={status.value}>
                  {t(`language.${status.title}`)}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => (
              <div className="language_form--submitBtn">
                <Button
                  htmlType="submit"
                  type="primary"
                  disabled={hasErrorOnFields}
                >
                  <PlusCircleFilled />
                  {formBtnTitle}
                </Button>
              </div>
            )}
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}

export default LanguageForm;
