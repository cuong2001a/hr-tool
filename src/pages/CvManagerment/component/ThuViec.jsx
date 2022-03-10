import { Button, DatePicker, Form, Input, message, Radio } from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import OnBoardCV from '../../../api/onBoard';
import probationApi from '../../../api/thuViec';
import {
  FORMAT_DATEPICKER,
  TIME_DATEPICKER,
} from '../../../constants/toInterview';
const ThuViec = memo(props => {
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
      const { data } = await OnBoardCV.getById(id);
      if (data.status === 'error') {
        message.error(t('onboard.fail'));
        setVisible(0);
      } else if (data.data.status !== 2) {
        message.error(t('onboard.fail'));
        setVisible(0);
      } else {
        const data = {
          cv_id: id,
          todate: value.time.unix(),
          ...value,
        };
        const res = await probationApi.post(data);
        setVisible(0);
        if (value.status === 2) {
          message.success(t('probation.success'));
        } else if (value.status === 1) {
          message.error(t('probation.fail'));
        } else if (value.status === 0) {
          message.warn(t('probation.extend'));
        } else {
          message.success(t('probation.inprogressing'));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getProbationById = async () => {
    const { data } = await probationApi.getById(id);
    setItem(data.data);
  };
  useEffect(() => {
    getProbationById();
  }, []);
  useEffect(() => {
    form.setFieldsValue({
      notes: item?.notes || '',
      status: item?.status || 0,
      time: item?.todate ? moment.unix(item.todate) : '',
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
          name="status"
          label={t('review.status')}
        >
          <Radio.Group
            onChange={changeCheckFail}
            style={{ textTransform: 'uppercase' }}
          >
            <Radio value={2}>{t('review.success')}</Radio>
            <Radio value={1}>{t('review.fail')}</Radio>
            <Radio value={0}>{t('probation.extend')}</Radio>
            <Radio value={3}>{t('probation.inprogressing')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          style={{ marginBottom: '12px' }}
          label={
            <span>
              <span style={{ marginRight: '5px' }}>{`${t(
                'probation.day',
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
            style={{ height: '120px', marginBottom: '12px' }}
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

export default ThuViec;
