import { Button, Checkbox, Dropdown, Menu, message, Table } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import React, { useEffect, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import planApi from '../../api/planApi';
import Export from '../../assets/images/statistic/export 1.svg';
import Eye from '../../assets/images/statistic/eye.svg';
import Fullscreen from '../../assets/images/statistic/Vector.svg';
import { CONFIG_PAGINATION } from '../../constants';
import {
  offerRequest,
  onboardOffer,
  onboardRequest,
} from '../../utils/caculatePercent';
function TableGeneral(props) {
  const { filter, setFilter } = props;
  const { t, i18n } = useTranslation();
  const [dataTable, setDataTable] = useState([]);
  const handle = useFullScreenHandle();
  const [dataExport, setDataExport] = useState([]);
  const navi = useNavigate();

  const handleClickDetail = item => {
    const { month, year } = item;
    navi(`/plan/detail?month=${month}&year=${year}`);
  };
  const handleChange = pagination => {
    const { current: page, pageSize: limit } = pagination;
    setFilter(prev => ({
      ...prev,
      page: page.toString(),
      limit: limit.toString(),
    }));
  };

  const columnsTable = [
    {
      title: t('plan.month_year'),
      dataIndex: 'month_year',
      show: true,
      key: '0',
      render(_, item) {
        return <span>{`${item.month}/${item.year}`}</span>;
      },
    },
    {
      title: t('plan.number_of_request'),
      dataIndex: 'target',
      show: true,
      summary: true,
      key: '1',
    },
    {
      title: t('plan.number_of_cv'),
      dataIndex: 'total_cv',
      show: true,

      key: '2',
    },
    {
      title: t('plan.number_of_cv_joined_interview'),
      dataIndex: 'interview_cv',
      show: true,
      key: '3',
    },
    {
      title: t('plan.number_of_cv_passed_interview'),
      dataIndex: 'pass_cv',
      show: true,

      key: '4',
    },
    {
      title: t('plan.number_of_uv_offered'),
      dataIndex: 'offer_cv',
      show: true,

      key: '5',
    },
    {
      title: t('plan.offer_successfully'),
      dataIndex: 'offer_success',
      show: true,

      key: '6',
    },
    {
      title: t('plan.number_of_uv_worked'),
      dataIndex: 'onboard_cv',
      show: true,

      key: '7',
    },
    {
      title: t('plan.ratio_offer_request'),
      dataIndex: 'ratio_offer_request',
      show: true,
      render(text, item) {
        return (
          <span>{`${
            offerRequest(item.offer_success, item.target) || 0
          }%`}</span>
        );
      },
      key: '8',
    },
    {
      title: t('plan.ratio_onboard_request'),
      dataIndex: 'ratio_onboard_request',
      show: true,
      render(text, item) {
        return (
          <span>{`${onboardRequest(item.onboard_cv, item.target) || 0}%`}</span>
        );
      },
      key: '9',
    },
    {
      title: t('plan.ratio_onboard_offer'),
      dataIndex: 'ratio_onboard_offer',
      show: true,
      render(text, item) {
        return (
          <span>{`${
            onboardOffer(item.onboard_cv, item.offer_success) || 0
          }%`}</span>
        );
      },
      key: '10',
    },
    {
      title: t('plan.number_of_failed_people'),
      dataIndex: 'fail_job',
      show: true,
      key: '11',
    },
    {
      title: t('plan.rest'),
      dataIndex: 'rest',
      show: true,
      render(_, item) {
        const value = item.target - item.onboard_cv;
        return <span>{value > 0 ? value : ''}</span>;
      },
      key: '12',
    },
    {
      title: t('plan.action'),
      dataIndex: 'action',
      show: true,
      fixed: 'right',
      key: '13',
      render(_, item) {
        return (
          <Button type="primary" onClick={() => handleClickDetail(item)}>
            {t('plan.detail')}
          </Button>
        );
      },
    },
  ];
  const [columns, setColumns] = useState(columnsTable);

  const menuEye = (
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

  useEffect(() => {
    planApi
      .getDataTablePlan(filter)
      .then(resp => {
        setDataTable(resp.data);
      })
      .catch(e => {
        message.error(e);
      });
  }, [filter]);
  useEffect(() => {
    planApi
      .getDataTablePlan({ litmit: 16 })
      .then(resp => {
        setDataExport(resp.data.data);
      })
      .catch(e => {
        message.error(e);
      });
  }, []);
  const newDataTable =
    dataExport?.length > 0
      ? dataExport.map(item => {
          const ratioOR = `${
            offerRequest(item.offer_success, item.target) || 0
          }%`;
          const ratioOnR = `${
            onboardRequest(item.onboard_cv, item.target) || 0
          }%`;
          const ratioOO = `${
            onboardOffer(item.onboard_cv, item.offer_success) || 0
          }%`;
          const year = `${item.month}/${item.year}`;
          const rest = item.target - item.onboard_cv;
          return {
            ...item,
            rest: rest,
            month_year: year,
            ratio_offer_request: ratioOR,
            ratio_onboard_request: ratioOnR,
            ratio_onboard_offer: ratioOO,
          };
        })
      : [];
  const handleExportToExcel = () => {
    const excel = new Excel();
    excel
      .addSheet('Data Plan')
      .addColumns(
        columns
          .filter(column => column.show && column.dataIndex !== 'action')
          .map(item => {
            delete item.render;
            return item;
          }),
      )
      .addDataSource(newDataTable)
      .saveAs('Plan.xlsx');
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
          <Dropdown overlay={menuEye} placement="bottomRight" arrow>
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
          rowKey="total_cv"
          columns={columns.filter(item => item.show === true)}
          dataSource={dataTable.data}
          pagination={{
            ...CONFIG_PAGINATION,
            total: dataTable.total,
            pageSize: 10,
            showQuickJumper: false,
          }}
          scroll={{
            y: 450,
            x: '100vw',
          }}
          onChange={handleChange}
          bordered
        />
      </FullScreen>
    </section>
  );
}

export default TableGeneral;
