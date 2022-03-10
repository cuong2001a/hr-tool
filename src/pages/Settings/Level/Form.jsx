import { Button, Drawer, Input, Radio, Form, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { t } from 'i18next';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postLevel, updateLevel } from '../../../api/level/levelApi';
import { PlusCircleFilled } from '@ant-design/icons/lib/icons';
import { LIST_STATUS } from '../../../constants/level';
import { setReloadTable, setVisibles } from './reducer/Level';
const FormGeneral = ({ visibles, valueForm, fetchApi }) => {
  const { visible, formContent } = useSelector(state => state.level);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleSubmit = async values => {
    if (formContent.title === t('level.create-level')) {
      await postLevel(values);
    } else {
      await updateLevel(valueForm.id, values);
    }
    fetchApi();
    dispatch(setVisibles(visibles));
  };

  useEffect(() => {
    form.resetFields();
  });

  useEffect(() => {
    form.setFieldsValue({
      title: valueForm?.title || '',
      description: valueForm?.description || '',
      status: valueForm?.status ?? 1,
    });
  }, [valueForm]);

  return (
    <div className="formal">
      <Drawer
        title={formContent.title}
        placement="right"
        visible={visible}
        onClose={() => dispatch(setVisibles(false))}
        zIndex="2000"
        getContainer={false}
        bodyStyle={{ overflow: 'unset', padding: '16px 29px 17px 22px' }}
      >
        <div className="level--header__content">
          <Form
            onFinish={handleSubmit}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
              status: 1,
            }}
            form={form}
          >
            <Form.Item
              name="title"
              label={
                <span className="field--required">
                  {`${t('typework.title')}`} (<span>*</span>)
                </span>
              }
              rules={[
                { min: 3, message: t('typework.titleMinLength') },
                { required: true, message: t('typework.titleRequired') },
              ]}
            >
              <Input placeholder={t('level.titlePlaceholder')} />
            </Form.Item>
            <Form.Item name="description" label={t('typework.description')}>
              <TextArea
                type="textarea"
                rows={4}
                placeholder={t('typework.descriptionPlaceholder')}
              />
            </Form.Item>
            <Form.Item
              name="status"
              className="collection-create-form_last-form-item"
              label={t('source.statusColumn')}
            >
              <Radio.Group>
                {LIST_STATUS.map(status => (
                  <Radio key={status.id} value={status.value}>
                    {t(`language.${status.title}`)}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item className="custom-button">
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusCircleFilled />}
              >
                {formContent.btn}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </div>
  );
};

export default FormGeneral;
