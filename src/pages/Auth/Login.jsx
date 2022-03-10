import { Button, Col, Input, Row, Form, message } from 'antd';
import bg from '../../assets/images/login/bg.png';
import logo from '../../assets/images/login/logoHivetech.png';
import { useDispatch } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { setLogin } from './reducer/auth';
import {
  getRefreshToken,
  setCookieRefreshToken,
  setToken,
} from '../../api/Cookie';
import { postLogin } from '../../api/userApi';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const token = getRefreshToken('Refresh-Token');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navi = useNavigate();
  const handleLogin = async value => {
    try {
      const data = {
        username: value.username,
        password: value.password,
      };
      const res = await postLogin(data);
      if (res.status === 200) {
        dispatch(setLogin(res.data.data));
        setToken(res.data.data.access_token);
        setCookieRefreshToken(res.data.data.refresh_token);
        message.success(t('login.success'));
        navi('/');
      } else {
        message.warn(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const redirect = () => {
    if (!token) {
      return (
        <div className="login ">
          <Row justify="space-around" align="middle">
            <Col lg={9} xl={9} className="login--left">
              <img src={bg} alt="" />
            </Col>
            <Col sm={14} md={12} lg={10} xl={7}>
              <div className="login--right">
                <div className="login--right__header">
                  <img src={logo} alt="" />
                  <p>{t('login.header')}</p>
                </div>
                <div className="login--right__content">
                  <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    onFinish={handleLogin}
                  >
                    <Form.Item
                      label={
                        <span className="field--required">
                          {t('login.username')} (<span>*</span>)
                        </span>
                      }
                      style={{ marginBottom: '12px!important' }}
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: t('login.message-error.username'),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label={
                        <span className="field--required">
                          {t('login.password')} (<span>*</span>)
                        </span>
                      }
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: t('login.message-error.password'),
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <div style={{ textAlign: 'end', margin: '16px 0' }}>
                      <Link
                        to="/forgotpassword"
                        style={{ color: 'rgba(0, 0, 0, 0.85)' }}
                      >
                        {t('login.forgot-password')}
                      </Link>
                    </div>
                    <Form.Item>
                      <Button htmlType="submit" type="danger">
                        {t('login.title')}
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      );
    }
    return <Navigate to="/" />;
  };
  return <>{redirect()}</>;
};
export default Login;
