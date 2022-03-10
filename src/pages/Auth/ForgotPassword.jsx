import { Form, Button, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
// import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import bg from '../../assets/images/login/bg.png';
import logo from '../../assets/images/login/logoHivetech.png';
const ForgotPassword = () => {
  const { t } = useTranslation();
  const navi = useNavigate();
  const handleBackLogin = () => {
    navi('/login');
  };

  return (
    <div className="login">
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
              >
                <Form.Item>
                  <p style={{ marginBottom: 4 }}>{t('forgotpassword.title')}</p>
                  <p style={{ marginBottom: 86 }}>
                    {t('forgotpassword.it-helpdesk')}
                  </p>
                </Form.Item>
                <Form.Item>
                  <Button type="danger" onClick={handleBackLogin}>
                    BACK
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ForgotPassword;
