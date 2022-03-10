import { LogoutOutlined } from '@ant-design/icons';
import { Badge, Button, Layout, Popover } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getUser } from '../../api/auth/user';
import { removeToken } from '../../api/Cookie';
import BellIcon from '../../assets/images/header/Bell.svg';
import logo from '../../assets/images/header/logo.svg';
import QuestionIcon from '../../assets/images/header/QuestionCircle.svg';
import SearchIcon from '../../assets/images/header/Search.svg';
import UserIcon from '../../assets/images/header/Setting.svg';
import { setLogin } from '../../pages/Auth/reducer/auth';

function Header(props) {
  const { Header } = Layout;
  const { userInfor } = useSelector(state => state.auth);
  const { t, i18n } = useTranslation();
  const navi = useNavigate();
  const handleLogout = () => {
    removeToken('Auth-Token');
    removeToken('Refresh-Token');
    navi('/login');
  };
  return (
    <Header className="header">
      <div className="header__logo">
        <Link to="/">
          <img src={logo} alt="logo" />
          <span>{t('header.hrtool')}</span>
        </Link>
      </div>
      <div className="header__add">
        <div className="header__add--user user">
          <a className="user__info" href="#!">
            <img src={UserIcon} alt="UserIcon" />
            <span>{userInfor.username}</span>
          </a>
        </div>
        <div className="header__add--actions">
          <a href="#!" onClick={handleLogout}>
            <LogoutOutlined /> {t('header.logout')}
          </a>
        </div>
      </div>
    </Header>
  );
}

export default Header;
