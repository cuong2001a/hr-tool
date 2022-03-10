import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import Action from '../../assets/images/statistic/action.svg';
function Summary() {
  const summary = useSelector(state => state.tableDashboard.listDataSummary);
  const { target, total_cv, onboard_cv, offer_success, offer_cv } = summary;

  return (
    <section>
      <Row gutter={16}>
        <Col span={6}>
          <Card className="card">
            <div className="card__header">
              <h4 className="total">{target}</h4>
              <Button type="text" style={{ padding: 0 }}>
                <img src={Action} alt="action" />
              </Button>
            </div>
            <div className="card__body">
              <p>Vị trí cần tuyển</p>
              <InfoCircleOutlined />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card">
            <div className="card__header">
              <h4 className="total">{total_cv}</h4>
              <Button type="text" style={{ padding: 0 }}>
                <img src={Action} alt="action" />
              </Button>
            </div>
            <div className="card__body">
              <p>Đơn ứng tuyển</p>
              <InfoCircleOutlined />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card">
            <div className="card__header">
              <h4 className="total">{onboard_cv}</h4>
              <Button type="text" style={{ padding: 0 }}>
                <img src={Action} alt="action" />
              </Button>
            </div>
            <div className="card__body">
              <p>Ứng viên đã tuyển</p>
              <InfoCircleOutlined />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card">
            <div className="card__header">
              <h4 className="total">{`${Math.round(
                (offer_success / offer_cv) * 100,
              )}%`}</h4>
              <Button type="text" style={{ padding: 0 }}>
                <img src={Action} alt="action" />
              </Button>
            </div>
            <div className="card__body">
              <p>Tỉ lệ thành công</p>
              <InfoCircleOutlined />
            </div>
          </Card>
        </Col>
      </Row>
    </section>
  );
}

export default Summary;
