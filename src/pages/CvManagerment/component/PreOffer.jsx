import { Button, Form, Input, message, Radio, Select } from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { getLevel } from '../../../api/level/levelApi';
import PhysiognomyReview2Api from '../../../api/PhysiognomyReview2Api';
import PreOfferCV from '../../../api/preOffer';
const PreOffer = memo(props => {
  const { setVisible } = props;
  const footerBtnSubmit = useRef();
  const [form] = Form.useForm();
  const [item, setItem] = useState();
  const { Option } = Select;
  const { id } = useParams();
  const [arrLevel, setArrLevel] = useState([]);
  const [checkFail, setCheckFail] = useState(false);
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
      const { data } = await PhysiognomyReview2Api.getById(id);
      if (data.status === 'error') {
        message.error(t('review.failPsychology2'));
        setVisible(0);
      } else if (data.data.status !== 2) {
        message.error(t('review.failPsychology2'));
        setVisible(0);
      } else {
        const data = {
          cv_id: id,
          ...value,
        };
        console.log(data);
        const res = await PreOfferCV.post(data);
        setVisible(0);
        if (value.status === 2) {
          message.success(t('preoffer.success'));
        } else if (value.status === 1) {
          message.error(t('preoffer.fail'));
        } else {
          message.warn(t('review.depend'));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllLevel = async () => {
    const params = {
      limit: 100,
    };
    const { data } = await getLevel(params);
    const levelArr = [
      ...new Set(
        data.data.map(item => {
          return {
            level_title: item.title,
            level_id: item.id,
          };
        }),
      ),
    ];
    setArrLevel(levelArr);
  };
  const getPreOfferById = async () => {
    try {
      const { data } = await PreOfferCV.getById(id);
      setItem(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllLevel();
    getPreOfferById();
  }, []);
  useEffect(() => {
    form.setFieldsValue({
      level_id: item?.level_id,
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
      <p>
        {t('preoffer.checkList')}{' '}
        <a href="#">
          <span>{t('preoffer.show')}</span>
        </a>
      </p>
      <Form
        className="drawer__detail"
        form={form}
        layout="vertical"
        onFinish={handleFormCreate}
        initialValue={{ status: 0 }}
      >
        <Form.Item
          style={{ marginBottom: '12px' }}
          label={t('level.title')}
          name="level_id"
        >
          <Select placeholder="Sales">
            {arrLevel &&
              arrLevel.map((item, index) => {
                return (
                  <Option key={index} value={item.level_id ?? ''}>
                    {item.level_title}
                  </Option>
                );
              })}
          </Select>
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

export default PreOffer;
