import {
  Button,
  Checkbox,
  Drawer,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Select,
  Table,
} from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import planApi from '../../../api/planApi';
import Export from '../../../assets/images/statistic/export 1.svg';
import Eye from '../../../assets/images/statistic/eye.svg';
import Fullscreen from '../../../assets/images/statistic/Vector.svg';
import {
  CONFIG_PAGINATION,
  LIST_ASSESSMENT,
  MONTH_FORMAT,
  PRIORITY_LIST,
} from '../../../constants';
import { setListRequest } from '../reducer/plan-reducer';

function TableReport(props) {
  const { filterDetail, setFilterDetail } = props;
  const { TextArea } = Input;
  const handle = useFullScreenHandle();
  const [form] = Form.useForm();
  const { Option } = Select;
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const listUser = useSelector(state => state.detailParams.listUser);
  const [sources, setSources] = useState([]);
  const [placement, setPlacement] = useState('right');
  const [dataTable, setDataTable] = useState([]);
  const dispatch = useDispatch();
  const [dataExport, setDataExport] = useState([]);
  const [typework, setTypework] = useState([]);
  const [idRowTable, setIdRowTable] = useState();
  const [amount, setAmount] = useState();
  const [reload, setReload] = useState(false);
  const footerRef = useRef();
  const formRef = useRef();
  const showDrawer = (id, target) => {
    setVisible(true);
    setIdRowTable(id);
    setAmount(target);
  };

  const onClose = () => {
    setVisible(false);
  };
  const onFinishDrawer = value => {
    const newValue = {};
    Object.keys(value).map(key => {
      if (typeof value[key] === 'number') {
        newValue[key] = value[key].toString();
      } else if (!value[key]) {
        delete value.key;
      } else {
        newValue[key] = value[key];
      }
    });
    newValue['target'] = amount;
    planApi
      .fixPlan(idRowTable, newValue)
      .then(resp => {
        message.success(t('plan.fix_successfully'));
        setVisible(false);
        formRef.current.resetFields();
        setReload(!reload);
      })
      .catch(e => {
        message.error(e);
        setVisible(false);
        formRef.current.resetFields();
      });
  };

  const columnsTable = [
    {
      title: '#',
      dataIndex: 'id',
      show: true,
      key: '0',
    },
    {
      title: t('plan.department'),
      dataIndex: 'department',
      show: false,
      key: '1',
    },
    {
      title: t('plan.position'),
      dataIndex: 'position_title',
      show: true,
      summary: true,
      key: '2',
    },
    {
      title: t('plan.requestor'),
      dataIndex: 'requestor_id',
      show: true,

      key: '3',
    },
    {
      title: t('plan.request_date'),
      dataIndex: 'datecreate',
      show: true,
      render(_, item) {
        return <span>{moment(_ * 1000).format('MM/YYYY')}</span>;
      },
      key: '4',
    },
    {
      title: t('plan.deadline'),
      dataIndex: 'month_year',
      show: true,
      render(_, item) {
        return <span>{`${item.month}/${item.year}`}</span>;
      },
      key: '5',
    },
    {
      title: t('plan.language'),
      dataIndex: 'language',
      show: true,
      render(text) {
        return <span>{text?.slice(1, -1).replaceAll('"', '')}</span>;
      },
      key: '6',
    },
    {
      title: t('plan.employment_type'),
      dataIndex: 'typework_title',
      show: true,

      key: '7',
    },
    {
      title: t('plan.level'),
      dataIndex: 'level_title',
      show: true,
      key: '8',
    },
    {
      title: t('plan.amount'),
      dataIndex: 'target',
      show: true,

      key: '9',
    },
    {
      title: t('plan.recruited'),
      dataIndex: 'onboard_cv',
      show: true,

      key: '10',
    },
    {
      title: t('plan.status'),
      dataIndex: 'status',
      show: true,

      key: '11',
    },
    {
      title: t('plan.priority'),
      dataIndex: 'priority',
      show: true,
      render(text) {
        return (
          <span>
            {text === null ? t('plan.medium') : PRIORITY_LIST[text]?.title}
          </span>
        );
      },
      key: '12',
    },
    {
      title: t('plan.assessment'),
      dataIndex: 'assessment',
      show: true,
      render(_) {
        return <span>{LIST_ASSESSMENT[_].title || '-'}</span>;
      },
      key: '13',
    },
    {
      title: t('plan.assignee'),
      dataIndex: 'assignee_id',
      show: true,

      key: '14',
    },
    {
      title: t('plan.recruitment_chanel'),
      dataIndex: 'sources',
      show: true,
      render(text) {
        return <span>{text?.slice(1, -1).replaceAll('"', '')}</span>;
      },
      key: '14',
    },

    {
      title: t('plan.action'),
      dataIndex: 'action',
      show: true,
      fixed: 'right',

      render(_, item) {
        return (
          <Button
            type="primary"
            onClick={() => showDrawer(item.id, item.target)}
          >
            Sửa
          </Button>
        );
      },
      key: '16',
    },
  ];
  useEffect(() => {
    planApi
      .getTableDetail(filterDetail)
      .then(resp => {
        setDataTable(resp.data);
      })
      .catch(e => message.error(e));
  }, [reload, filterDetail]);
  const [columns, setColumns] = useState(columnsTable);
  const menu = (
    <Menu>
      {columns.map((item, id) => (
        <Menu.Item key={id}>
          <Checkbox
            checked={item.show}
            name={item.key}
            onChange={e => handleChecked(e, item.key)}
          />
          {item.title}
        </Menu.Item>
      ))}
    </Menu>
  );
  useEffect(() => {
    planApi
      .getDataSource({ limit: 0 })
      .then(resp => setSources(resp.data.data))
      .catch(e => message.error(e));
  }, []);
  useEffect(() => {
    planApi
      .getTableDetail({ limit: 1000 })

      .then(resp => {
        setDataExport(resp.data.data);
        dispatch(setListRequest(resp.data.data));
      })
      .catch(e => message.error(e));
  }, []);
  useEffect(() => {
    planApi
      .getTypework({ limit: 1000 })
      .then(resp => {
        setTypework(resp.data.data);
      })
      .catch(e => message.error(e));
  }, []);
  const listSources = dataExport.map(item => item.sources);
  const newListSources = [...new Set(listSources)];
  const newDataTable =
    dataExport?.length > 0
      ? dataExport.map(item => {
          const month_year = `${item.month}/${item.year}`;
          const date = moment(item.datecreate * 1000).format(MONTH_FORMAT);
          return { ...item, month_year: month_year, datecreate: date };
        })
      : [];
  const handleExportToExcel = () => {
    const excel = new Excel();
    excel
      .addSheet('Data Plan')
      .addColumns(
        columns
          .filter(
            column => column.show === true && column.dataIndex !== 'action',
          )
          .map(item => {
            delete item.render;
            return item;
          }),
      )
      .addDataSource(newDataTable)
      .saveAs('Plan.xlsx');
  };
  const handleTableChange = pagination => {
    const { current: page, pageSize: limit } = pagination;
    setFilterDetail(prev => ({ ...prev, page, limit }));
  };
  const handleChecked = (e, key) => {
    if (e.target.checked) {
      const newData = columns.map(item =>
        item.key === key ? { ...item, show: true } : item,
      );
      setColumns(newData);
    } else {
      const newData = columns.map(item =>
        item.key === key ? { ...item, show: false } : item,
      );
      setColumns(newData);
    }
  };

  return (
    <section className="report">
      <div className="report__header">
        <h4 className="statistic__chart--title chart">
          {t('statistic.report_recruitment')}
        </h4>
        <div>
          <Button type="text" onClick={handleExportToExcel}>
            <img src={Export} alt="export" />
          </Button>
          <Dropdown overlay={menu} placement="bottomRight" arrow>
            <Button type="text">
              <img src={Eye} alt="action" />
            </Button>
          </Dropdown>
          <Button type="text" onClick={handle.enter}>
            <img src={Fullscreen} alt="fullscreen" />
          </Button>
        </div>
      </div>
      <FullScreen handle={handle}>
        <Table
          className="table"
          rowKey="id"
          columns={columns.filter(item => item.show === true)}
          dataSource={dataTable.data}
          pagination={{
            ...CONFIG_PAGINATION,
            total: dataTable?.total,
            pageSize: 10,
            showQuickJumper: false,
          }}
          scroll={{
            y: 450,
            x: '100vw',
          }}
          onChange={handleTableChange}
          bordered
        />
      </FullScreen>
      <Drawer
        title={t('plan.fix_plan')}
        placement={placement}
        width={500}
        onClose={onClose}
        visible={visible}
        footer={
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => footerRef.current.click()}
            >
              Save
            </Button>
          </FormItem>
        }
      >
        <Form form={form} ref={formRef} onFinish={onFinishDrawer}>
          <FormItem
            name="typework_id"
            label={t('plan.typework')}
            labelCol={{ span: 24 }}
          >
            <Select placeholder={t('statistic.select_item')}>
              {typework.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.title}
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            name="assignee_id"
            label={t('plan.assignee')}
            labelCol={{ span: 24 }}
          >
            <Select placeholder={t('statistic.select_item')}>
              {listUser.map((item, id) => (
                <Option key={id} value={item.username}>
                  {item.username}
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            name="sources"
            label={t('plan.recruitment_chanel')}
            labelCol={{ span: 24 }}
          >
            <Select
              mode="multiple"
              maxTagCount="responsive"
              showArrow
              placeholder={t('statistic.select_item')}
            >
              {sources?.map(item => (
                <Option key={item.id} value={item.title}>
                  {item.title}
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            name="assessment"
            label={t('plan.assessment')}
            labelCol={{ span: 24 }}
          >
            <Select defaultValue={[1]}>
              {LIST_ASSESSMENT.map(item => (
                <Option key={item.id} value={item.value}>
                  {item.title}
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            name="description"
            label={t('plan.description')}
            labelCol={{ span: 24 }}
          >
            <TextArea rows={5} placeholder={t('plan.enter_description')} />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              hidden={true}
              ref={footerRef}
            >
              {t('plan.save')}
            </Button>
          </FormItem>
        </Form>
      </Drawer>
    </section>
  );
}

export default TableReport;
