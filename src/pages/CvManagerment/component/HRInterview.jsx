import React, { useEffect } from 'react';
import { Button, DatePicker, Form, Input, Radio, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import {
  CONDITION_NAME_FROM_BACKEND,
  DATE_FORMAT_BACKEND,
  MAX_SALARY_LENGTH,
} from '../../../constants/hrInterview';
import hrInterviewApi from '../../../api/hrInterviewApi';
import { DATE_FORMAT } from '../../../constants/index';
const { TextArea } = Input;

export default function HRInterview({ setVisible }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { id } = useParams();

  useEffect(async () => {
    try {
      const data = await hrInterviewApi.getByID(id);
      if (data.data.status === 'success') {
        const item = data.data.data;
        form.setFieldsValue({
          general: item?.notes,
          skill: item?.experience,
          reason: item?.reason,
          rate: item?.status || 0,
          currentSalary: convertToVietNamMoneyFormat(item?.salary_now),
          wishSalary: convertToVietNamMoneyFormat(item?.salary_want),
          onboard: moment(item.onboard, DATE_FORMAT_BACKEND),
        });
      } else {
        form.setFieldsValue({
          rate: 0,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const onFinish = async values => {
    try {
      const item = {
        cv_id: id,
        notes: values.general,
        experience: values.skill,
        reason: values.reason,
        status: values.rate,
        salary_now: convertToNumber(values.currentSalary),
        salary_want: convertToNumber(values.wishSalary),
        onboard: values.onboard.format(DATE_FORMAT_BACKEND),
      };
      const respond = await hrInterviewApi.post(item);
      if (respond.data.status !== 'success') {
        if (respond.data.message.includes(CONDITION_NAME_FROM_BACKEND))
          message.error(t('hrinterview.errorPass'));
      } else {
        message.success(t('hrinterview.editSuccess'));
        setVisible(0);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Begin: Money Handle
  const convertToNumber = s => Number((s + '').replace(/\./g, ''));

  const convertToVietNamMoneyFormat = str => {
    str += '';
    const len = str.length;
    let newStr = '';
    for (let i = len - 1; i >= 0; i--) {
      if ((i - len) % 3 === 0 && i !== 0) newStr = `.${str[i]}` + newStr;
      else newStr = str[i] + newStr;
    }
    return newStr;
  };
  const onChangeSalary = (e, field) => {
    let newStr = e.target.value;
    let str = convertToNumber(newStr);

    if (str && newStr.length <= MAX_SALARY_LENGTH) {
      newStr = convertToVietNamMoneyFormat(str);
    }
    form.setFieldsValue({
      [field]: newStr,
    });
  };

  const validateSalary = value => {
    if (value) {
      const number = convertToNumber(value);

      if (!number)
        return Promise.reject(new Error(t('hrinterview.salaryJustNumber')));

      if (value.length > MAX_SALARY_LENGTH) {
        return Promise.reject(new Error(t('hrinterview.salaryTooLong')));
      }
      return Promise.resolve();
    } else return Promise.reject(new Error(t('hrinterview.salaryRequired')));
  };

  const salaryRules = [{ validator: (_, value) => validateSalary(value) }];
  // End: Money Handle

  return (
    <div className="hr-review">
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="hr-review__form"
      >
        <div>
          <Form.Item name="general" label={t('hrinterview.general')}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="skill" label={t('hrinterview.skill')}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            className="hr-review__form-rate"
            name="rate"
            label={t('hrinterview.rate')}
          >
            <Radio.Group>
              <Radio value={2}>{t('hrinterview.successStatus')}</Radio>
              <Radio value={1}>{t('hrinterview.failStatus')}</Radio>
              <Radio value={0}>{t('hrinterview.pendingStatus')}</Radio>
              <Radio value={3}>{t('hrinterview.absentStatus')}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="reason" label={t('hrinterview.reason')}>
            <Input />
          </Form.Item>
          <div className="wrapper--horizontal">
            <Form.Item
              name="currentSalary"
              label={t('hrinterview.currentSalary')}
              rules={salaryRules}
            >
              <Input onChange={e => onChangeSalary(e, 'currentSalary')} />
            </Form.Item>
            <Form.Item
              name="wishSalary"
              label={t('hrinterview.wishSalary')}
              rules={salaryRules}
            >
              <Input onChange={e => onChangeSalary(e, 'wishSalary')} />
            </Form.Item>
            <Form.Item
              name="onboard"
              label={t('hrinterview.onboard')}
              className="hr-review__form-onboard"
              rules={[
                {
                  validator(_, value) {
                    if (value) {
                      if (
                        moment().isBefore(value) ||
                        moment().format(DATE_FORMAT) ===
                          value.format(DATE_FORMAT)
                      )
                        return Promise.resolve();
                      else
                        return Promise.reject(
                          new Error(t('hrinterview.futureTime')),
                        );
                    } else {
                      return Promise.reject(
                        new Error(t('hrinterview.requiredTime')),
                      );
                    }
                  },
                },
              ]}
            >
              <DatePicker format={DATE_FORMAT} />
            </Form.Item>
          </div>
        </div>
        <Form.Item className="hr-review__form-btn">
          <Button htmlType="submit" type="primary">
            {t('hrinterview.submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
