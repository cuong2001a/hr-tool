import React, { useState } from 'react';
import Data from './Data';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons/lib/icons';
import { useDispatch } from 'react-redux';
import { setIsFormShowed, setFormInterface } from './sourceSlice';

function CvResource(props) {
  const { t } = useTranslation();
  const [initialForm, setInitialForm] = useState({});
  const dispatch = useDispatch();
  const handleCreate = () => {
    setInitialForm({});
    dispatch(setIsFormShowed(true));
    dispatch(
      setFormInterface({
        btn: t('source.createBtn'),
        title: t('source.createTitle'),
      }),
    );
  };

  return (
    <div className="source">
      <div className="source-header">
        <h2>{t('source.title')}</h2>
        <Button
          onClick={handleCreate}
          type="primary"
          icon={<PlusCircleFilled />}
        >
          {t('source.titleCreate')}
        </Button>
      </div>

      <Data setInitialForm={setInitialForm} initialForm={initialForm} />
    </div>
  );
}

export default CvResource;
