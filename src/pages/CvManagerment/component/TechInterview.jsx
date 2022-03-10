import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Radio, Select, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { getLevel } from '../../../api/level/levelApi';
import techInterviewApi from '../../../api/techInterviewApi';
import {
  POINT_LADDER,
  CHILDREN_NUMBER,
  CONDITION_NAME_FROM_BACKEND,
  ACTIVE_AND_ALL_PARAM,
} from '../../../constants/techInterview';
import { useParams } from 'react-router-dom';

const { Option } = Select;

export default function TechInterview({ setVisible }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { id } = useParams();

  const [levelList, setLevelList] = useState([]);

  useEffect(() => {
    fetchlevelList();
    fillFormInital();
  }, []);

  const fetchlevelList = async () => {
    try {
      const respond = await getLevel(ACTIVE_AND_ALL_PARAM);
      setLevelList(respond.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fillFormInital = async () => {
    try {
      const respond = await techInterviewApi.getById(id);
      console.log(respond);
      if (respond.data.status === 'success') {
        const item = respond.data.data;
        form.setFieldsValue({
          language: item?.language,
          tech: item?.expertise,
          suitable: item?.character_note,
          skill: item?.knowledge,
          appraisal: item?.self_appraisal,
          orient: item?.career_direction,
          questions: item?.questions,
          notes: item?.notes,
          level: item?.level_id,
          techPoint: item?.point_tech,
          handlerPoint: item?.point_handler,
          thinkingPoint: item?.point_thinking,
          reason: item?.reason,
          rate: item?.status || 0,
        });
      } else {
        form.setFieldsValue({
          rate: 0,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const inputNumberProps = {
    type: 'number',
  };
  const pointRules = [
    {
      validator(_, value) {
        value = Number(value);
        if (value < 0) return Promise.reject(t('techinterview.pointMin'));
        if (value > 10) return Promise.reject(t('techinterview.pointMax'));
        return Promise.resolve();
      },
    },
  ];

  const onFinish = async values => {
    try {
      const item = {
        cv_id: id,
        language: values.language,
        expertise: values.tech,
        character_note: values.suitable,
        knowledge: values.skill,
        self_appraisal: values.appraisal,
        career_direction: values.orient,
        questions: values.questions,
        notes: values.notes,
        level_id: values.level,
        point_tech: values.techPoint,
        point_handler: values.handlerPoint,
        point_thinking: values.handlerPoint,
        status: values.rate,
        reason: values.reason,
      };
      const respond = await techInterviewApi.post(item);
      console.log(respond);
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

  return (
    <div className="tech-review">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="language" label={t('techinterview.language')}>
          <Input />
        </Form.Item>
        <Form.Item name="tech" label={t('techinterview.tech')}>
          <Input />
        </Form.Item>
        <Form.Item name="suitable" label={t('techinterview.suitable')}>
          <Input />
        </Form.Item>
        <Form.Item name="skill" label={t('techinterview.skill')}>
          <Input />
        </Form.Item>
        <Form.Item name="appraisal" label={t('techinterview.appraisal')}>
          <Input />
        </Form.Item>
        <Form.Item name="orient" label={t('techinterview.orient')}>
          <Input />
        </Form.Item>
        <Form.Item name="questions" label={t('techinterview.questions')}>
          <Input />
        </Form.Item>
        <Form.Item name="notes" label={t('techinterview.notes')}>
          <Input />
        </Form.Item>
        <Form.Item name="level" label={t('techinterview.level')}>
          <Select placeholder={t('techinterview.levelPlaceholder')}>
            {levelList.map(level => (
              <Option value={level.id} key={level.id}>
                {level.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <div style={{ marginBottom: 5 }}>
          {`${t('techinterview.point')} (${t(
            'techinterview.pointLadder',
          )} ${POINT_LADDER}) `}
        </div>
        <div className="wrapper--horizontal">
          <Form.Item
            name="techPoint"
            label={t('techinterview.techPoint')}
            rules={pointRules}
          >
            <Input {...inputNumberProps} />
          </Form.Item>
          <Form.Item
            name="handlerPoint"
            label={t('techinterview.handlerPoint')}
            rules={pointRules}
          >
            <Input {...inputNumberProps} />
          </Form.Item>
          <Form.Item
            name="thinkingPoint"
            label={t('techinterview.thinkingPoint')}
            rules={pointRules}
          >
            <Input {...inputNumberProps} />
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const g = s => Number(form.getFieldValue(s));
              return (
                <div>
                  <label>{`${t('techinterview.pointsSum')}: `}</label>
                  {g('thinkingPoint') + g('handlerPoint') + g('techPoint') || 0}
                  /{POINT_LADDER * CHILDREN_NUMBER}
                </div>
              );
            }}
          </Form.Item>
        </div>
        <Form.Item
          className="hr-review__form-rate"
          name="rate"
          label={t('hrinterview.rate')}
        >
          <Radio.Group>
            <Radio value={2}>{t('hrinterview.successStatus')}</Radio>
            <Radio value={1}>{t('hrinterview.failStatus')}</Radio>
            <Radio value={0}>{t('hrinterview.pendingStatus')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="reason" label={t('hrinterview.reason')}>
          <Input />
        </Form.Item>
        <Form.Item className="tech-interview-submit">
          <Button type="primary" htmlType="submit">
            {t('hrinterview.submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
