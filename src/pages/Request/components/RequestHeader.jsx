import { PlusCircleFilled } from '@ant-design/icons';
import { Button, message, PageHeader } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import languageApi from '../../../api/languageApi';
import { getLevel } from '../../../api/level/levelApi';

import typeworkApi from '../../../api/typeworkApi';
import {
  CREATE_TITLE_FORM,
  PARAMS_GET_ALL,
} from '../../../constants/requestPage';
import {
  setListLanguages,
  setListLevel,
  setListPosition,
  setListTypeWork,
  changeVisibleRequestForm,
} from '../requestSlice';
import { positionApi } from '../../../api/positionApi';

function RequestHeader({ onChangeTitleForm, onChangeTitleButtonForm }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleCreateRequest = async e => {
    try {
      onChangeTitleForm(CREATE_TITLE_FORM);
      onChangeTitleButtonForm(t('request.titleButtonCreateRequest'));
      // await all fetch data
      await Promise.all([
        fetchListLevel(),
        fetchListTypeWork(),
        fetchListPosition(),
        fetchListLanguages(),
      ]);

      dispatch(changeVisibleRequestForm(true));
    } catch (error) {
      message.error(t('request.failToCreateRequest'));
    }
  };

  const fetchListLevel = async () => {
    try {
      // call api get list level with status = 1
      const response = await getLevel(PARAMS_GET_ALL);
      dispatch(setListLevel(response.data.data));
    } catch (error) {
      message.error(t('request.failToFetchListLevel'));
    }
  };

  const fetchListTypeWork = async () => {
    try {
      // call api get list level with status = 1
      const response = await typeworkApi.getAll(PARAMS_GET_ALL);
      dispatch(setListTypeWork(response.data.data));
    } catch (error) {
      message.error(t('request.failToFetchListTypeWork'));
    }
  };

  const fetchListPosition = async () => {
    try {
      // call api get list level with status = 1
      const response = await positionApi.getAllPosition(PARAMS_GET_ALL);
      dispatch(setListPosition(response.data.data));
    } catch (error) {
      message.error(t('request.failToFetchListTypeWork'));
    }
  };

  const fetchListLanguages = async () => {
    try {
      // call api get list level with status = 1
      const response = await languageApi.getAll(PARAMS_GET_ALL);
      dispatch(setListLanguages(response.data.data));
    } catch (error) {
      message.error(t('request.failToFetchListTypeWork'));
    }
  };

  return (
    <PageHeader
      ghost={false}
      title={t('request.request')}
      extra={[
        <Button key="1" type="primary" onClick={handleCreateRequest}>
          <PlusCircleFilled />
          <span className="language__addBtn">{t('request.createRequest')}</span>
        </Button>,
      ]}
    />
  );
}

export default RequestHeader;
