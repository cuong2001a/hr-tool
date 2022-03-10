import { Button, DatePicker, Form, Input, message, Radio } from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import OfferCV from '../../../api/offer';
import OnBoardCV from '../../../api/onBoard';
import {
  FORMAT_DATEPICKER,
  TIME_DATEPICKER,
} from '../../../constants/toInterview';
const OnBoard = memo(props => {
  const { setVisible } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { id } = useParams();
  const [checkFail, setCheckFail] = useState(false);
  const [item, setItem] = useState();
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
      const { data } = await OfferCV.getById(id);
      if (data.status === 'error') {
        console.log(1);
        message.error(t('offer.fail'));
        setVisible(0);
      } else if (data.data.status !== 2) {
        console.log(2);
        message.error(t('offer.fail'));
        setVisible(0);
      } else {
        const data = {
          cv_id: id,
          onboard: value.time.unix(),
          ...value,
        };
        const res = await OnBoardCV.post(data);
        console.log(res);
        setVisible(0);
        if (value.status === 2) {
          message.success(t('onboard.success'));
        } else if (value.status === 1) {
          message.error(t('onboard.fail'));
        } else {
          message.warn(t('onboard.delay'));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getDataById = async () => {
    try {
      const { data } = await OnBoardCV.getById(id);
      console.log(data);
      setItem(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDataById();
  }, []);
  useEffect(() => {
    form.setFieldsValue({
      time: item?.appoint_date ? moment.unix(item.appoint_date) : '',
      status: item?.status,
      notes: item?.notes,
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
        initialValues={{ status: 0 }}
        onFinish={handleFormCreate}
      >
        <Form.Item
          style={{ marginBottom: '12px' }}
          label={
            <span>
              <span style={{ marginRight: '5px' }}>{`${t(
                'onboard.date',
              )}`}</span>
              (
              <span
                className="position__title-required"
                style={{ color: 'red' }}
              >
                *
              </span>
              )
            </span>
          }
          name="time"
          rules={[
            {
              validator(_, value) {
                if (value) {
                  if (value.isBefore(moment())) return Promise.resolve();
                  else
                    return Promise.reject(
                      new Error(t('onboard.errorFutureTime')),
                    );
                } else return Promise.reject(t('tointerview.requiredTime'));
              },
            },
          ]}
        >
          <DatePicker
            allowClear={false}
            dropdownClassName="time"
            style={{ width: '100%' }}
            format={FORMAT_DATEPICKER}
            showTime={{ format: TIME_DATEPICKER }}
          />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: '12px' }}
          name="status"
          label={t('review.status')}
        >
          <Radio.Group
            onChange={changeCheckFail}
            style={{ textTransform: 'uppercase' }}
          >
            <Radio value={2}>{t('cv.WentWork')}</Radio>
            <Radio value={1}>{t('cv.NotToWork')}</Radio>
            <Radio value={0}>{t('cv.Postpone')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          style={{ marginBottom: '12px' }}
          label={t('review.review')}
          name="notes"
          rules={[
            {
              required: checkFail,
              message: t('review.requireStatus'),
            },
          ]}
        >
          <Input.TextArea
            style={{ height: '120px' }}
            showCount
            maxLength={1000}
            placeholder={t('review.enterNote')}
          />
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

export default OnBoard;
