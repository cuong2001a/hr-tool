import { PlusCircleFilled } from '@ant-design/icons';
import { Button, DatePicker, Drawer, Form, Input, message, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import requestApi from '../../../api/requestApi';
import { DEFAULT_BEFORE_REQUEST_DAY } from '../../../constants';
import {
  CREATE_TITLE_FORM,
  DATE_FORMAT_DAY_CREATED,
  DEADLINE_FORMATED,
  DEADLINE_RULES,
  DEFAULT_AUTHOR_LEVEL,
  DEFAULT_MAX_LENGTH_DESCRIPTION,
  DEFAULT_PRIORITY,
  DEFAULT_TYPEWORK,
  DETAIL_TITLE_FORM,
  EDIT_TITLE_FORM,
  LIST_REQUEST_STATUS,
  QUANTITY_RULES,
} from '../../../constants/requestPage';
import {
  changeVisibleRequestForm,
  setReloadTable,
  setRequestFormInfo,
} from '../requestSlice';

const { Option } = Select;

function RequestForm({ titleForm, titleButtonForm }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [isDetailForm, setIsDetailForm] = useState(false);
  const [listLevelRender, setListLevelRender] = useState([]);
  const [listLanguageRender, setListLanguageRender] = useState([]);
  const [hasErrorsOnFields, setHasErrorsOnFields] = useState(true);
  const [, forceUpdate] = useState({}); // To disable submit button at the beginning.
  const [isTouchedRequireField, setIsTouchedRequireField] = useState(false);

  const visibleRequestForm = useSelector(
    state => state.request.visibleRequestForm,
  );
  const requestor = useSelector(state => state.auth.userInfor);
  const listLevel = useSelector(state => state.request.listLevel);
  const listTypeWork = useSelector(state => state.request.listTypeWork);
  const listPosition = useSelector(state => state.request.listPosition);
  const listLanguages = useSelector(state => state.request.listLanguages);
  const requestFormInfo = useSelector(state => state.request.requestFormInfo);

  let groupPosition = {};
  let firstPosition = {};

  if (Object.keys(listPosition).length) {
    groupPosition = listPosition.reduce((groups, item) => {
      if (item.parent_title) {
        const group = groups[item.parent_title] || [];
        group.push(item);
        groups[item.parent_title] = group;
      }
      return groups;
    }, {});
    firstPosition = groupPosition[Object.keys(groupPosition)[0]][0];
  }

  const firstLevelId = listLevelRender.length ? listLevelRender[0]['id'] : [];

  useEffect(() => {
    setListLevelRender(
      listLevel.filter(level => level.author_id === DEFAULT_AUTHOR_LEVEL),
    );
  }, [listLevel]);

  useEffect(() => {
    forceUpdate({});
  }, []);

  useEffect(() => {
    setListLanguageRender([...new Set(listLanguages.map(lang => lang.title))]);
  }, [listLanguages]);

  useEffect(() => {
    setIsDetailForm(titleForm === DETAIL_TITLE_FORM);
  }, [titleForm]);

  useEffect(() => {
    form.resetFields();
  }, [visibleRequestForm]);

  useEffect(() => {
    if (titleForm === CREATE_TITLE_FORM) {
      form.setFieldsValue({
        requestor_id: requestor.username,
        position_id: firstPosition.id,
        level_id: firstLevelId,
        typework_id: DEFAULT_TYPEWORK,
        priority: DEFAULT_PRIORITY[4].value,
      });
    } else {
      form.setFieldsValue({
        requestor_id: requestor.username,
        position_id: requestFormInfo.position_id,
        level_id: requestFormInfo.level_id,
        quantity: requestFormInfo.target,
        typework_id: requestFormInfo.typework_id,
        deadline: moment(
          `${requestFormInfo.year}-${requestFormInfo.month}`,
          DEADLINE_FORMATED,
        ),
        languages: requestFormInfo.languages
          ? JSON.parse(requestFormInfo.languages)
          : undefined,
        priority: requestFormInfo.priority,
        description: requestFormInfo.description,
      });
    }
  }, [visibleRequestForm]);

  useEffect(() => {
    setHasErrorsOnFields(titleForm === CREATE_TITLE_FORM);
    setIsTouchedRequireField(true);
  }, [visibleRequestForm]);

  const disableDate = current => {
    return current <= dayjs().add(DEFAULT_BEFORE_REQUEST_DAY, 'day');
  };

  const handleCreatRequest = async values => {
    const payload = { ...values };

    delete payload.deadline;
    delete payload.quantity;
    // add target and year month fields
    payload.target = parseInt(values.quantity);
    payload.month = dayjs(values.deadline).month() + 1;
    payload.year = dayjs(values.deadline).year();
    payload.requestor_id = values['requestor_id'];

    // convert number[] to number
    Object.keys(payload).forEach(item => {
      let valueOfItem = payload[item];
      if (Array.isArray(valueOfItem) && valueOfItem.length) {
        if (typeof valueOfItem[0] === 'number') {
          payload[item] = valueOfItem[0];
        }
      }
    });

    try {
      await requestApi.create(payload);
      message.success(t('request.createRequestSuccess'));
      dispatch(changeVisibleRequestForm(false));
      dispatch(setReloadTable());
    } catch (error) {
      message.error(t('request.failToCreateRequest'));
    }
  };

  const handleEditRequest = async values => {
    const payload = { ...values };
    delete payload.deadline;
    delete payload.quantity;

    // add target and year month fields
    payload.target = parseInt(values.quantity);
    payload.month = dayjs(values.deadline).month() + 1;
    payload.year = dayjs(values.deadline).year();

    try {
      await requestApi.edit(requestFormInfo.id, payload);
      dispatch(changeVisibleRequestForm(false));
      dispatch(setReloadTable());
      message.success(t('request.editRequestSuccess'));
    } catch (error) {
      message.success(t('request.editRequestFail'));
      throw new Error(error);
    }
  };

  const handleCloseDrawer = () => {
    dispatch(changeVisibleRequestForm(false));
    dispatch(setRequestFormInfo({}));
  };

  const handleChangeStatusRequest = async payload => {
    try {
      payload.target = requestFormInfo.target;
      await requestApi.edit(requestFormInfo.id, payload);
      message.success(t('request.titleChangeStatusSuccess'));
      dispatch(changeVisibleRequestForm(false));
      dispatch(setReloadTable());
    } catch (error) {
      message.success(t('request.titleChangeStatusFail'));
    }
  };

  // handle disabled submit button
  const handleFieldsChange = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);
    const isTouchedFields = form.isFieldsTouched(
      ['quantity', 'deadline'],
      true,
    );
    console.log('hasErrors :', hasErrors);
    console.log('isTouchedFields :', isTouchedFields);
    setIsTouchedRequireField(isTouchedFields);
    setHasErrorsOnFields(hasErrors);
  };

  return (
    <>
      <Drawer
        className="request__drawer"
        forceRender
        placement="right"
        title={titleForm}
        visible={visibleRequestForm}
        onClose={() => handleCloseDrawer()}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          className="request__form"
          onFieldsChange={handleFieldsChange}
          onFinish={
            titleForm === CREATE_TITLE_FORM
              ? handleCreatRequest
              : titleForm === EDIT_TITLE_FORM
              ? handleEditRequest
              : () =>
                  handleChangeStatusRequest({
                    status: LIST_REQUEST_STATUS[2].value,
                  })
          }
        >
          <Form.Item name="requestor_id" label={t('request.requestor')}>
            <Select disabled>
              {[requestor].map(req => (
                <Option key={req.username} value={req.username}>
                  {req.username}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="position_id" label={t('request.position')}>
            <Select disabled={isDetailForm}>
              {Object.keys(groupPosition).map((key, id) => {
                return (
                  <Select.OptGroup label={key} value={key} key={id}>
                    {groupPosition[key].map(value => {
                      return (
                        <Option key={value.id} value={value.id}>
                          {value.title}
                        </Option>
                      );
                    })}
                  </Select.OptGroup>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item name="level_id" label={t('request.level')}>
            <Select disabled={isDetailForm}>
              {listLevelRender.map(level => (
                <Option key={level.id} value={level.id}>
                  {level.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="quantity"
            label={
              <span>
                {`${t('request.quantity')}`} (
                <span className="request__title--required"></span>)
              </span>
            }
            rules={QUANTITY_RULES}
            hasFeedback={!isDetailForm}
          >
            <Input
              disabled={isDetailForm}
              placeholder={t('request.placeholderQuantity')}
              type="number"
              className="request__form--quantity"
            />
          </Form.Item>
          <Form.Item name="typework_id" label={t('request.typework')}>
            <Select disabled={isDetailForm}>
              {listTypeWork.map(typework => (
                <Option key={typework.id} value={typework.id}>
                  {typework.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="deadline"
            label={
              <span>
                {`${t('request.deadline')}`} (
                <span className="request__title--required"></span>)
              </span>
            }
            rules={DEADLINE_RULES}
            hasFeedback={!isDetailForm}
          >
            <DatePicker
              getPopupContainer={triggerNode => triggerNode.parentNode}
              disabled={isDetailForm}
              format={DATE_FORMAT_DAY_CREATED}
              disabledDate={disableDate}
              placeholder={t('request.placeholderDatePicker')}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item name="languages" label={t('request.language')}>
            <Select
              mode="multiple"
              disabled={isDetailForm}
              placeholder={t('request.placeholderLanguages')}
              showArrow
            >
              {listLanguageRender.map(lang => (
                <Option key={lang} value={lang}>
                  {lang}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="priority" label={t('request.priority')}>
            <Select disabled={isDetailForm}>
              {DEFAULT_PRIORITY.map(priority => (
                <Option key={priority.value} value={priority.value}>
                  {priority.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label={t('request.description')}>
            <TextArea
              disabled={isDetailForm}
              rows={4}
              showCount
              allowClear
              maxLength={DEFAULT_MAX_LENGTH_DESCRIPTION}
              placeholder={t('request.placeholderDescription')}
            />
          </Form.Item>

          <Form.Item
            shouldUpdate
            className={`request__form__actions ${
              isDetailForm && requestFormInfo.status ? 'display-none' : ''
            }`}
          >
            {() => (
              <div className="request__form--listBtn">
                <Button
                  htmlType="submit"
                  type="primary"
                  hidden={isDetailForm && requestFormInfo.status}
                  disabled={!isTouchedRequireField ? true : hasErrorsOnFields} // true && false
                >
                  {titleForm === CREATE_TITLE_FORM && <PlusCircleFilled />}
                  {titleButtonForm}
                </Button>
                <Button
                  danger
                  type="primary"
                  hidden={!isDetailForm || requestFormInfo.status}
                  onClick={() =>
                    handleChangeStatusRequest({
                      status: LIST_REQUEST_STATUS[1].value,
                    })
                  }
                >
                  {t('request.titleRejectRequest')}
                </Button>
              </div>
            )}
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}

export default RequestForm;
