import { Layout, Menu } from 'antd';
import React, { useEffect } from 'react';
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import { useSelector } from 'react-redux';
import { getIsLoggedIn, getToken } from '../api/Cookie';

const { Content } = Layout;

function MainLayout(props) {
  const token = getToken('Auth-Token');

  const redirect = () => {
    if (token) {
      return (
        <Layout>
          <Header />
          <Content>
            <Layout className="site-layout-background">
              <Sidebar />
              <Content className="main__content">
                <Outlet />
              </Content>
            </Layout>
          </Content>
        </Layout>
      );
    }
    return <Navigate to="/login" />;
  };
  return <>{redirect()}</>;
}

export default MainLayout;
