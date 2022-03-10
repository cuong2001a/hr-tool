import { Button, Checkbox, Dropdown, Menu, Table, Typography } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import React, { useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Export from '../../assets/images/statistic/export 1.svg';
import Eye from '../../assets/images/statistic/eye.svg';
import Fullscreen from '../../assets/images/statistic/Vector.svg';
import {
  offerRequest,
  onboardOffer,
  onboardRequest,
} from '../../utils/caculatePercent';

function Report() {
  const { t, i18n } = useTranslation();
  const summary = useSelector(state => state.tableDashboard.listDataSummary);
  const { offer_success, onboard_cv, target } = summary;
  const newSumary = { ...summary };
  newSumary['ratio_offer_request'] = `${
    offerRequest(offer_success, target) || 0
  }%`;
  newSumary['ratio_onboard_request'] = `${
    onboardRequest(onboard_cv, target) || 0
  }%`;
  newSumary['ratio_onboard_offer'] = `${
    onboardOffer(onboard_cv, offer_success) || 0
  }%`;
  const dataTable = useSelector(state => state.tableDashboard.listData);
  const { Text } = Typography;
  const handle = useFullScreenHandle();

  const columnsTable = [
    {
      title: t('statistic.department'),
      dataIndex: 'department',
      show: false,
      key: '0',
    },
    {
      title: t('statistic.position'),
      dataIndex: 'positions_title',
      show: true,
      summary: true,
      key: '1',
    },
    {
      title: t('statistic.level'),
      dataIndex: 'level_title',
      show: true,

      key: '2',
    },
    {
      title: t('statistic.prioritize'),
      dataIndex: 'priority',
      show: true,
      render(text) {
        return <span>{text === null ? 'Medium' : text}</span>;
      },
      key: '3',
    },
    {
      title: t('statistic.number_of_request'),
      dataIndex: 'target',
      show: true,

      key: '4',
    },
    {
      title: t('statistic.number_of_cv'),
      dataIndex: 'total_cv',
      show: true,

      key: '5',
    },
    {
      title: t('statistic.number_of_cv_joined_interview'),
      dataIndex: 'interview_cv',
      show: true,

      key: '6',
    },
    {
      title: t('statistic.number_of_cv_passed_interview'),
      dataIndex: 'pass_cv',
      show: true,

      key: '7',
    },
    {
      title: t('statistic.number_of_uv_offered'),
      dataIndex: 'offer_cv',
      show: true,

      key: '8',
    },
    {
      title: t('statistic.offer_successfully'),
      dataIndex: 'offer_success',
      show: true,

      key: '9',
    },
    {
      title: t('statistic.number_of_uv_worked'),
      dataIndex: 'onboard_cv',
      show: true,

      key: '10',
    },
    {
      title: t('statistic.ratio_offer_request'),
      dataIndex: 'ratio_offer_request',
      show: true,
      render(text, item) {
        return (
          <span>{`${
            offerRequest(item.offer_success, item.target) || 0
          }%`}</span>
        );
      },
      key: '11',
    },
    {
      title: t('statistic.ratio_onboard_request'),
      dataIndex: 'ratio_onboard_request',
      show: true,
      render(text, item) {
        return (
          <span>{`${onboardRequest(item.onboard_cv, item.target) || 0}%`}</span>
        );
      },
      key: '12',
    },
    {
      title: t('statistic.ratio_onboard_offer'),
      dataIndex: 'ratio_onboard_offer',
      show: true,
      render(text, item) {
        return (
          <span>{`${
            onboardOffer(item.onboard_cv, item.offer_success) || 0
          }%`}</span>
        );
      },
      key: '13',
    },
    {
      title: t('statistic.finish_day'),
      dataIndex: 'year',
      show: true,
      render(text, item) {
        return <span>{`${item.month}/${text}`}</span>;
      },
      key: '14',
    },
    {
      title: t('statistic.number_of_failed_people'),
      dataIndex: 'fail_job',
      show: true,

      key: '15',
    },
    {
      title: t('statistic.list_of_uv_work'),
      dataIndex: 'employees',
      show: true,
      render(text) {
        return <span>{text?.slice(1, -1).replaceAll('"', '')}</span>;
      },
      key: '16',
    },
  ];

  const newDataTable =
    dataTable?.length > 0
      ? dataTable.map(item => {
          const employees = item.employees?.slice(1, -1).replaceAll('"', '');
          const ratioOR = `${
            Math.round(
              (item.offer_success / (item.target !== 0 ? item.target : 1)) *
                100,
            ) || 0
          }%`;
          const ratioOnR = `${
            Math.round(
              (item.onboard_cv / (item.target !== 0 ? item.target : 1)) * 100,
            ) || 0
          }%`;
          const ratioOO = `${Math.round(
            (item.onboard_cv /
              (item.offer_success !== 0 ? item.offer_success : 1)) *
              100 || 0,
          )}%`;
          const year = `${item.month}/${item.year}`;
          const priority = item.priority === null ? 'Medium' : item.priority;
          return {
            ...item,
            priority: priority,
            year: year,
            ratio_offer_request: ratioOR,
            ratio_onboard_request: ratioOnR,
            ratio_onboard_offer: ratioOO,
            employees: employees,
          };
        })
      : [];
  const [columns, setColumns] = useState(columnsTable);

  const handleExportToExcel = () => {
    const excel = new Excel();
    excel
      .addSheet('Data Dashboard')
      .addColumns(
        columns
          .filter(column => column.show === true)
          .map(item => {
            delete item.render;
            return item;
          }),
      )
      .addDataSource(newDataTable)
      .saveAs('Dashboard.xlsx');
  };
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
          dataSource={dataTable}
          pagination={false}
          scroll={{
            y: 450,
            x: '100vw',
          }}
          bordered
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                {columns.map((column, id) => {
                  if (column.show === false) return;
                  if (column.summary)
                    return (
                      <Table.Summary.Cell key={id}>
                        <strong>{t('statistic.summary')}</strong>
                      </Table.Summary.Cell>
                    );
                  if (column.dataIndex in newSumary) {
                    return (
                      <Table.Summary.Cell key={id} index={id}>
                        <Text strong type="danger" style={{ fontSize: '18px' }}>
                          {newSumary[column.dataIndex]}
                        </Text>
                      </Table.Summary.Cell>
                    );
                  }
                  return (
                    <Table.Summary.Cell
                      key={id}
                      index={id}
                    ></Table.Summary.Cell>
                  );
                })}
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </FullScreen>
    </section>
  );
}

export default Report;
