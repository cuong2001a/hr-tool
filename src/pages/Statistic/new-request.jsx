import { Button, Dropdown, Menu } from 'antd';
import React from 'react';
import { Pie, Radar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Action from '../../assets/images/statistic/action.svg';
import RequestIcon from '../../assets/images/statistic/_IconPlaceholder.svg';
import qs from 'query-string';
import { useLocation } from 'react-router-dom';
import { LABELSRADAR } from '../../constants';
function NewRequest() {
  const summary = useSelector(state => state.tableDashboard.listDataSummary);
  const department = useSelector(
    state => state.tableDashboard.listDataDepartment,
  );
  const { labels, values, colors } = department;
  const { target, total_cv, interview_cv, pass_cv } = summary;
  const { t } = useTranslation();
  const location = useLocation();
  const data = {
    labels: LABELSRADAR,
    datasets: [
      {
        data: [total_cv, interview_cv, pass_cv, target],
        fill: true,
        backgroundColor: 'rgba(91, 143, 249, 0.25)',
        borderColor: '#5B8FF9',
      },
    ],
  };
  const dataPie = {
    labels: labels,
    datasets: [
      {
        data: values,
        fill: true,
        backgroundColor: colors,
      },
    ],
  };
  const queryParams = qs.parse(location.search);
  const options = {
    plugins: {
      tooltip: {
        titleFont: {
          size: '16px',
        },
      },
      legend: {
        display: false,
      },
    },
    elements: {
      line: {
        borderWidth: 3,
      },
    },
    responsive: true,
  };
  const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" href="">
          <img src={RequestIcon} alt="action" />
          {t('statistic.export')}
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" href="">
          <img src={RequestIcon} alt="action" />
          {t('statistic.hide')}
        </a>
      </Menu.Item>
    </Menu>
  );
  return (
    <div className="ratio">
      <section className="statistic__subbinformation">
        <div className="statistic__subbinformation--item subinformation__item">
          <div className="item">
            <div className="item__title">
              <h4 className="statistic__chart--title chart">
                {t('statistic.amount_recruit')}
              </h4>
              <p className="chart--name">{`${queryParams.month}/${queryParams.year}`}</p>
            </div>
            <Dropdown overlay={menu} placement="bottomRight" arrow>
              <Button type="text">
                <img src={Action} alt="action" />
              </Button>
            </Dropdown>
          </div>
          <div className="pie">
            <Pie data={dataPie} options={options} />
          </div>
        </div>
      </section>
      <section className="statistic__subbinformation">
        <div className="statistic__subbinformation--item subinformation__item">
          <div className="item">
            <div className="item__title">
              <h4 className="statistic__chart--title chart">
                {t('statistic.ratio_recruitment')}
              </h4>
              <p className="chart--name">{`${queryParams.month}/${queryParams.year}`}</p>
            </div>
            <Dropdown overlay={menu} placement="bottomRight" arrow>
              <Button type="text">
                <img src={Action} alt="action" />
              </Button>
            </Dropdown>
          </div>
          <div className="radar">
            <Radar data={data} options={options} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default NewRequest;
