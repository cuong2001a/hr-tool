import { PlusCircleFilled } from '@ant-design/icons';
import { Button, PageHeader } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { changeEdit, changeVisibleDrawer } from '../../commonSlice/userSlice';
import { ACTION_BUTTTON } from './constant';

/**
 * @author
 * @function UserHeader
 **/

const UserHeader = props => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const showDrawer = () => {
    dispatch(changeVisibleDrawer(true));
    dispatch(changeEdit(false));
  };
  return (
    <PageHeader
      className="setting-header"
      ghost={false}
      title={t('user.pageHeaderTitle')}
      extra={[
        <Button
          key="1"
          type="primary"
          icon={<PlusCircleFilled />}
          onClick={showDrawer}
          className="button-header"
        >
          {ACTION_BUTTTON.map(e => t(`user.${e}`))}
        </Button>,
      ]}
    ></PageHeader>
  );
};

export default React.memo(UserHeader);
