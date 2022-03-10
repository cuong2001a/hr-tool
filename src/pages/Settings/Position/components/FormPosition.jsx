import { PlusCircleFilled } from '@ant-design/icons';
import { Button, Drawer, Form, Input, message, Radio, Select } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { positionApi } from '../../../../api/positionApi';
import { DEFAULT_STATUS } from '../../../../constants';
import {
  setReloadTalbe,
  showFormPosition,
  getDetailPosition,
} from '../reducer';
const { Option } = Select;
function FormPosition(props) {
  const { formBtnTitle, formTilte, isEdit } = props;
  const { visibleFormPosition, department, manager, requestor, detailData } =
    useSelector(item => item.position);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const onClose = () => {
    dispatch(showFormPosition(false));
    dispatch(getDetailPosition({}));
  };
  useEffect(() => {
    form.resetFields();
  }, [visibleFormPosition]);
  const handleFormCreate = async value => {
    try {
      const res = await positionApi.postPosition(value);
      console.log(res);
      dispatch(setReloadTalbe());
      dispatch(showFormPosition(false));
      message.success(t('position.successCreate'));
    } catch (error) {
      console.log(error);
    }
  };
  const handelFormEdit = async value => {
    try {
      const dataEdit = {
        ...detailData,
        ...value,
      };
      console.log(value);
      const res = await positionApi.putPosition(dataEdit);
      console.log('res:', res);
      dispatch(setReloadTalbe());
      dispatch(showFormPosition(false));
      message.success(t('position.successEdit'));
    } catch (error) {
      console.log(error);
    }
  };
  console.log();
  useEffect(() => {
    if (formTilte === t('position.createPosition')) {
      form.setFieldsValue({
        parent_id: department[0]?.parent_id,
        description: '',
        status: DEFAULT_STATUS,
        title: '',
        manager_id: manager[0],
        requestor: [],
      });
    } else {
      form.setFieldsValue({
        parent_id: detailData?.parent_id || [],
        description: detailData?.description || '',
        status: detailData?.status ?? DEFAULT_STATUS,
        title: detailData?.title || '',
        manager_id: detailData?.manager_id || [],
        requestor: detailData?.requestor || [],
      });
    }
  }, [visibleFormPosition]);

  const submitBtn = useRef();
  return (
    <div className="position__form">
      <Drawer
        title={formTilte}
        placement="right"
        onClose={onClose}
        visible={visibleFormPosition}
        getContainer={false}
        footerStyle={{ border: 'none', padding: '21px 17px' }}
        bodyStyle={{ padding: '16px 29px 0px 22px' }}
        footer={
          <Button
            icon={<PlusCircleFilled />}
            color="white"
            type="primary"
            htmlType="submit"
            onClick={() => submitBtn.current.click()}
          >
            {formBtnTitle}
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={isEdit ? handleFormCreate : handelFormEdit}
        >
          <Form.Item
            label={t('position.department')}
            name="parent_id"
            style={{ marginBottom: '12px' }}
          >
            <Select placeholder={t('position.placeholderSelect')}>
              {department &&
                department?.map((item, index) => {
                  return (
                    <Option key={index} value={item.parent_id ?? ''}>
                      {item.parent_title}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            style={{ marginBottom: '12px' }}
            label={
              <span>
                <span style={{ marginRight: '5px' }}>{`${t(
                  'position.position',
                )}`}</span>
                (<span className="position__title-required"></span>)
              </span>
            }
            rules={[
              {
                required: true,
                message: t('position.errorRequired'),
              },
              {
                min: 3,
                message: t('position.errorMinLength'),
              },
              {
                max: 200,
                message: t('position.errorMaxLengthTitle'),
              },
            ]}
          >
            <Input placeholder="Sales" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: '12px' }}
            label={
              <span>
                <span style={{ marginRight: '5px' }}>{`${t(
                  'position.manager',
                )}`}</span>
                (<span className="position__title-required"></span>)
              </span>
            }
            name="manager_id"
            initialValue={manager[0]}
            rules={[{ required: true, message: t('position.requiredManager') }]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder={t('position.placeholderSelect')}
            >
              {manager?.map((item, index) => {
                return (
                  <Option key={index} value={item ?? ''}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            style={{ marginBottom: '12px' }}
            label={t('position.requestor')}
            name="requestor"
          >
            <Select
              mode="multiple"
              showArrow
              allowClear
              placeholder={t('position.placeholderChooseRequestor')}
              maxTagCount="responsive"
              style={{ width: '100%' }}
            >
              {requestor?.map((item, index) => {
                return (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            style={{ marginBottom: '12px' }}
            label={t('position.description')}
            rules={[
              {
                max: 5000,
                message: t('position.errorMaxLengthDescription'),
              },
            ]}
            name="description"
          >
            <Input.TextArea
              placeholder={t('position.description')}
              showCount
              maxLength={5000}
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: '12px' }}
            name="status"
            label={t('position.status')}
          >
            <Radio.Group defaultValue={1}>
              <Radio value={0}>{t('position.lock')}</Radio>
              <Radio value={1}>{t('position.unlock')}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button
              icon={<PlusCircleFilled />}
              color="white"
              type="primary"
              htmlType="submit"
              ref={submitBtn}
              hidden={true}
            >
              {formBtnTitle}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}

export default FormPosition;
