import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Drawer } from 'antd';
import { steps } from '../../constants/cvDetail';
import HRReview from './component/HRReview';
import CVReview from './component/CVReview';
import NhanTuong1 from './component/NhanTuong1';
import ToInterview from './component/ToInterview';
import Interview from './component/Interview';
import NhanTuong2 from './component/NhanTuong2';
import PreOffer from './component/PreOffer';
import Offer from './component/Offer';
import Onboard from './component/OnBoard';
import ThuViec from './component/ThuViec';
import DetailHrView from './component/DetailHrView';
import cvApi from '../../api/cvApi';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

function DetailCV(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [visible, setVisible] = useState(0);
  const [title, setTitle] = useState('');
  const [cv, setCv] = useState({});
  const getDetailOne = async id_cv => {
    const res = await cvApi.getById(id_cv);
    if (res.status === 200) {
      setCv(res.data.data);
    } else {
      console.log('ERROr');
    }
  };

  useEffect(() => {
    getDetailOne(id);
  }, []);

  useEffect(() => {
    if (visible === 0) getDetailOne(id);
  }, [visible]);

  const naviagate = useNavigate();
  const handleHistoryPage = () => {
    naviagate(-1);
  };
  const ReviewComponent = p => {
    switch (p.step) {
      case 1:
        setTitle(t('cv.STEP_HR_REVIEW'));
        return <HRReview setVisible={setVisible} />;
      case 2:
        setTitle(t('cv.STEP_CV_REVIEW'));
        return <CVReview setVisible={setVisible} />;
      case 3:
        setTitle(t('cv.STEP_NHAN_TUONG_1'));
        return <NhanTuong1 setVisible={setVisible} />;
      case 4:
        setTitle(t('cv.STEP_TO_INTERVIEW'));
        return <ToInterview setVisible={setVisible} />;
      case 5:
        setTitle(t('cv.STEP_INTERVIEW'));
        return <Interview {...p} />;
      case 6:
        setTitle(t('cv.STEP_NHAN_TUONG_2'));
        return <NhanTuong2 setVisible={setVisible} />;
      case 7:
        setTitle(t('cv.STEP_PRE_OFFER'));
        return <PreOffer setVisible={setVisible} />;
      case 8:
        setTitle(t('cv.STEP_OFFER'));
        return <Offer setVisible={setVisible} />;
      case 9:
        setTitle(t('cv.STEP_ON_BOARD'));
        return <Onboard setVisible={setVisible} />;
      case 10:
        setTitle(t('cv.STEP_THU_VIEC'));
        return <ThuViec setVisible={setVisible} />;
      default:
        return null;
    }
  };

  return (
    <div className="box-list-cv">
      <div className="box-history">
        <span className="box-history-btn" onClick={handleHistoryPage}>
          <ArrowLeftOutlined />
        </span>
        <h2>{cv.fullname}</h2>
      </div>
      <div className="box-button">
        {steps.map(step => (
          <Button
            key={step.id}
            type="primary"
            onClick={() => setVisible(step.id)}
            disabled={cv?.status === 1 && cv?.step < step.id}
          >
            {step.name}
          </Button>
        ))}
      </div>
      <DetailHrView valuesCv={cv} setVisible={setVisible} />
      <Drawer
        title={title}
        placement="right"
        visible={visible !== 0}
        onClose={() => setVisible(0)}
        width={848}
        bodyStyle={{ padding: '12px 22px 0px' }}
      >
        <ReviewComponent step={visible} />
      </Drawer>
    </div>
  );
}

export default DetailCV;
