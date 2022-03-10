import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { DEFAULT_SELECTED_MENU_SIDEBAR } from '../../constants/languagePage';
import { LIST_ROUTES } from '../../constants/listRoute';

const { SubMenu } = Menu;
const { Sider } = Layout;

function Sidebar(props) {
  const { t } = useTranslation();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState('');

  useEffect(() => {
    if (location.pathname.startsWith('/plan')) {
      setSelectedKey(`/plan`);
    } else {
      setSelectedKey(location.pathname);
    }
  }, [location.pathname]);

  return (
    <Sider className=" sidebar">
      <Menu
        mode="inline"
        className="sidebar__menu"
        defaultOpenKeys={['setting']}
        selectedKeys={[
          location.pathname.length > 1
            ? selectedKey
            : DEFAULT_SELECTED_MENU_SIDEBAR,
        ]}
      >
        {LIST_ROUTES.map(route => {
          const { path, icon, child, title } = route;
          return child.length ? (
            <SubMenu
              className="sidebar__subMenu"
              key={title}
              icon={icon}
              title={t(`sidebar.${title}`)}
            >
              {child.map(item => {
                return (
                  <Menu.Item icon={item.icon} key={item.path}>
                    <Link to={item.path}>{t(`sidebar.${item.title}`)}</Link>
                  </Menu.Item>
                );
              })}
            </SubMenu>
          ) : (
            <Menu.Item icon={icon} key={path}>
              <Link to={path}>{t(`sidebar.${title}`)}</Link>
            </Menu.Item>
          );
        })}
      </Menu>
    </Sider>
  );
}

export default Sidebar;
