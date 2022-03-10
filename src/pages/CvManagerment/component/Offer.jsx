import { Button, Form, Input, message, Radio } from 'antd';
import React, { memo, useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import OfferCV from '../../../api/offer';
import PreOfferCV from '../../../api/preOffer';
const Offer = memo(props => {
  const { setVisible } = props;
  const footerBtnSubmit = useRef();
  const [form] = Form.useForm();
  const { id } = useParams();
  const [checkFail, setCheckFail] = useState(false);
  const [item, setItem] = useState();
  const { t } = useTranslation();
  const changeCheckFail = e => {
    if (e.target.value === 1) {
      setCheckFail(true);
    } else {
      setCheckFail(false);
    }
  };
  const handleFormCreate = async value => {
    try {
      const { data } = await PreOfferCV.getById(id);
      if (data.status === 'error') {
        message.error(t('preoffer.fail'));
        setVisible(0);
      } else if (data.data.status !== 2) {
        message.error(t('preoffer.fail'));
        setVisible(0);
      } else {
        const data = {
          cv_id: id,
          ...value,
        };
        console.log(data);
        const res = await OfferCV.post(data);
        console.log(res);
        setVisible(0);
        if (value.status === 2) {
          message.success(t('offer.success'));
        } else if (value.status === 1) {
          message.error(t('offer.fail'));
        } else {
          message.warn(t('review.depend'));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getOfferById = async () => {
    try {
      const { data } = await OfferCV.getById(id);
      console.log('offer', data);
      setItem(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getOfferById();
  }, []);
  useEffect(() => {
    form.setFieldsValue({
      notes: item?.notes || '',
      status: item?.status || 0,
      reason: item?.reason || '',
    });
  }, [item]);
  useEffect(() => {
    const a = form.getFieldValue('status');
    if (a === 1) {
      setCheckFail(true);
    } else {
      setCheckFail(false);
    }
  }, [item]);
  return (
    <div className="box-review">
      <Form
        className="drawer__detail"
        form={form}
        layout="vertical"
        onFinish={handleFormCreate}
      >
        <Form.Item
          style={{ marginBottom: '12px' }}
          label={t('offer.note')}
          name="notes"
        >
          <Input.TextArea
            style={{ height: '120px' }}
            showCount
            maxLength={1000}
            placeholder={t('review.enterNote')}
            style={{ marginBottom: '12px' }}
          />
        </Form.Item>
        <h5
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: 'rgba(0, 0, 0, 0,85)',
            lineHeight: '22px',
            textDecoration: 'underline',
          }}
        >
          {t('review.summary')}
        </h5>
        <Form.Item
          style={{ marginBottom: '12px' }}
          onChange={changeCheckFail}
          name="status"
        >
          <Radio.Group style={{ textTransform: 'uppercase' }}>
            <Radio value={2}>{t('review.success')}</Radio>
            <Radio value={1}>{t('review.fail')}</Radio>
            <Radio value={0}>{t('review.depending')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          style={{ marginBottom: '12px' }}
          label={t('review.reason')}
          name="reason"
          rules={[
            {
              required: checkFail,
              message: t('review.requireStatus'),
            },
          ]}
        >
          <Input placeholder={t('review.enterReason')} />
        </Form.Item>
        <Form.Item
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '34px',
            textAlign: 'end',
          }}
        >
          <Button
            color="white"
            type="primary"
            htmlType="submit"
            ref={footerBtnSubmit}
          >
            {t('review.save')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});

export default Offer;
