import { Button, Result } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

function NotFound(props) {
  const { t } = useTranslation();

  return (
    <div>
      <Result
        status="404"
        title="404"
        subTitle={t('notfound.subTitle')}
        extra={<Button type="primary">{t('notfound.buttonText')}</Button>}
      />
    </div>
  );
}

export default NotFound;
