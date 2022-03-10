import { Button, Col, Row } from 'antd';
import React from 'react';
import { PlusCircleFilled } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import {
  getDetailPosition,
  showFormDepartment,
  showFormPosition,
} from '../reducer';
import { useTranslation } from 'react-i18next';
function PositionHeader(props) {
  const { setFormTitle, setFormBtnTitle, setIsEdit } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const showPosition = async () => {
    setFormBtnTitle(t('position.create'));
    setFormTitle(t('position.createPosition'));
    setIsEdit(true);
    dispatch(showFormPosition(true));
    dispatch(getDetailPosition({}));
  };
  const showDepartment = () => {
    dispatch(showFormDepartment(true));
  };
  return (
    <div className="position__create">
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <h2 style={{ marginBottom: 0 }}>{t('position.position')}</h2>
        </Col>
        <Col className="gutter-row position__btn" span={12}>
          <Button
            className="position__btn-create"
            icon={<PlusCircleFilled />}
            color="white"
            type="primary"
            onClick={showDepartment}
          >
            {t('position.createDepartment')}
          </Button>
          <Button
            className="position__btn-create"
            icon={<PlusCircleFilled />}
            color="white"
            type="primary"
            onClick={showPosition}
          >
            {t('position.createPosition')}
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default PositionHeader;
