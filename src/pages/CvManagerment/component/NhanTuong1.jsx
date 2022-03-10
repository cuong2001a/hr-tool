import { Input, Radio, Form, Button, message } from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PhysiognomyReviewApi from '../../../api/PhysiognomyReviewApi';
import CVReviewApi from '../../../api/CVReviewApi';
const NhanTuong1 = memo(props => {
  const { setVisible } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { id } = useParams();
  const [item, setItem] = useState();
  const [checkFail, setCheckFail] = useState(false);
  const footerBtnSubmit = useRef();
  const changeCheckFail = e => {
    if (e.target.value === 1) {
      setCheckFail(true);
    } else {
      setCheckFail(false);
    }
  };
  const handleFormCreate = async value => {
    try {
      const { data } = await CVReviewApi.getById(id);
      console.log(data);
      if (data.status === 'error') {
        message.error(t('review.failCV'));
        setVisible(0);
      } else if (data.data.status !== 2) {
        message.error(t('review.failCV'));
        setVisible(0);
      } else {
        const data = {
          cv_id: id,
          ...value,
        };
        const res = await PhysiognomyReviewApi.post(data);
        console.log(res);
        setVisible(0);
        if (value.status === 2) {
          message.success(t('review.passPsychology'));
        } else if (value.status === 1) {
          message.error(t('review.failPsychology'));
        } else {
          message.warn(t('review.depend'));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDataPhysiognomy = async () => {
    try {
      const { data } = await PhysiognomyReviewApi.getById(id);
      console.log(data);
      setItem(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataPhysiognomy();
  }, []);
  useEffect(() => {
    form.setFieldsValue({
      notes: item?.notes || '',
      psychology: item?.psychology || '',
      ability: item?.ability || '',
      thinking: item?.thinking || '',
      communication: item?.communication || '',
      summary: item?.summary || '',
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
      <Form form={form} layout="vertical" onFinish={handleFormCreate}>
        <Form.Item
          label={
            <span>
              <span style={{ marginRight: '5px' }}>{`${t(
                'review.psychology',
              )}`}</span>
              (<span className="step__title-required"></span>)
            </span>
          }
          style={{ marginBottom: '12px' }}
          name="psychology"
          rules={[{ required: true, message: t('review.requirePsychology') }]}
        >
          <Input placeholder="A" />
        </Form.Item>
        <Form.Item
          label={
            <span>
              <span style={{ marginRight: '5px' }}>{`${t(
                'review.ability',
              )}`}</span>
              (<span className="step__title-required"></span>)
            </span>
          }
          style={{ marginBottom: '12px' }}
          name="ability"
          rules={[{ required: true, message: t('review.requireAbility') }]}
        >
          <Input placeholder="A" />
        </Form.Item>
        <Form.Item
          label={
            <span>
              <span style={{ marginRight: '5px' }}>{`${t(
                'review.thinking',
              )}`}</span>
              (<span className="step__title-required"></span>)
            </span>
          }
          style={{ marginBottom: '12px' }}
          name="thinking"
          rules={[{ required: true, message: t('review.requireThinking') }]}
        >
          <Input placeholder="A" />
        </Form.Item>
        <Form.Item
          label={
            <span>
              <span style={{ marginRight: '5px' }}>{`${t(
                'review.communication',
              )}`}</span>
              (<span className="step__title-required"></span>)
            </span>
          }
          style={{ marginBottom: '12px' }}
          name="communication"
          rules={[
            { required: true, message: t('review.requireCommunication') },
          ]}
        >
          <Input placeholder="A" />
        </Form.Item>
        <Form.Item
          label={
            <span>
              <span style={{ marginRight: '5px' }}>{`${t(
                'review.summary',
              )}`}</span>
              (<span className="step__title-required"></span>)
            </span>
          }
          style={{ marginBottom: '12px' }}
          name="summary"
          rules={[{ required: true, message: t('review.requireSummary') }]}
        >
          <Input placeholder="A" />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: '12px' }}
          label={t('review.review')}
          name="notes"
        >
          <Input.TextArea
            style={{ height: '120px' }}
            showCount
            maxLength={1000}
            placeholder={t('review.enterNote')}
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
        <Form.Item style={{ marginBottom: '12px' }} name="status">
          <Radio.Group
            onChange={changeCheckFail}
            style={{ textTransform: 'uppercase' }}
          >
            <Radio value={2}>{t('review.success')}</Radio>
            <Radio value={1}>{t('review.fail')}</Radio>
            <Radio value={0}>{t('review.depending')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label={
            <span>
              <span style={{ marginRight: '5px' }}>{`${t(
                'review.reason',
              )}`}</span>
              (<span className="step__title-required"></span>)
            </span>
          }
          style={{ marginBottom: '12px' }}
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
          style={{ marginBottom: '20px', textAlign: 'end', marginTop: '102px' }}
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

export default NhanTuong1;
