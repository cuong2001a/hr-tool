import { PlusCircleFilled } from '@ant-design/icons';
import { Button, PageHeader } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @author
 * @function PageHeader
 **/

export const PageHeaderRole = props => {
  const { t } = useTranslation();

  return (
    <PageHeader
      ghost={false}
      title={t('role.roleTitle')}
      extra={[
        <Button
          key="1"
          type="primary"
          icon={<PlusCircleFilled />}
          className="button-header"
          onClick={() => {
            props.setIsEdit(false);
            props.showDrawerAdd(true);
          }}
        >
          {t('role.buttonCreate')}
        </Button>,
      ]}
    ></PageHeader>
  );
};
