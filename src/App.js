import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import './assets/scss/app.scss';
import MainLayout from './layouts';
import CvManagerment from './pages/CvManagerment';
import NotFound from './pages/NotFound';
import Plan from './pages/Plan';
import Request from './pages/Request';
import Common from './pages/Settings/Common';
import Source from './pages/Settings/Source';
import Language from './pages/Settings/Language';
import Level from './pages/Settings/Level';
import Role from './pages/Settings/Role';
import User from './pages/Settings/User';
import Statistic from './pages/Statistic';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import { getRefreshToken, setCookieRefreshToken, setToken } from './api/Cookie';
import { postRefeshToken } from './api/userApi';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLogin } from './pages/Auth/reducer/auth';
import TypeWork from './pages/Settings/TypeWork';
import Position from './pages/Settings/Position/Position';
import { Spin } from 'antd';
import PlanDetail from './pages/Plan/detail';
import DetailCV from './pages/CvManagerment/Detail';

function App() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navi = useNavigate();
  const sendRequest = async () => {
    const refreshToken = getRefreshToken('Refresh-Token');
    if (!refreshToken) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } else {
      const res = await postRefeshToken({ refresh_token: refreshToken });
      if (res.status === 200 && res.data.status === 'success') {
        setToken(res.data.data.access_token);
        setCookieRefreshToken(res.data.data.refresh_token);
        dispatch(setLogin(res.data.data));
        setTimeout(() => {
          sendRequest();
        }, res.data.data.expires_in * 1000 - 240000);
      } else {
        navi('/login');
      }
    }
  };

  useEffect(() => {
    sendRequest();
  }, []);
  return (
    <Spin spinning={loading}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="statistic" element={<Statistic />} />
          <Route path="request" element={<Request />} />
          <Route path="plan" element={<Plan />} />
          <Route path="plan/detail" element={<PlanDetail />} />
          <Route path="cv-managerment" element={<CvManagerment />} />
          <Route path="cv" element={<CvManagerment />} />
          <Route path="cv/:id" element={<DetailCV />} />
          <Route path="*" element={<NotFound />} />
          <Route index element={<Statistic />} />
        </Route>
        <Route path="setting" element={<MainLayout />}>
          <Route path="common" element={<Common />} />
          <Route path="position" element={<Position />} />
          <Route path="level" element={<Level />} />
          <Route path="language" element={<Language />} />
          <Route path="source" element={<Source />} />
          <Route path="type-work" element={<TypeWork />} />
          <Route path="user" element={<User />} />
          <Route path="role" element={<Role />} />
          <Route index element={<Common />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      </Routes>
    </Spin>
  );
}

export default App;
