import { Button, Dropdown, Menu } from 'antd';
import { t } from 'i18next';
import React from 'react';
import { useSelector } from 'react-redux';
import Action from '../../assets/images/statistic/action.svg';
import RequestIcon from '../../assets/images/statistic/_IconPlaceholder.svg';
import DoughnutChart from './doughnut-chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
function Request() {
  Chart.register(ChartDataLabels);

  const listData = useSelector(state => state.tableDashboard.listDataSummary);
  const { offer_cv, target, onboard_cv } = listData;

  const dataOfferRequest = {
    labels: ['Đề nghị', 'Yêu cầu'],
    datasets: [
      {
        backgroundColor: ['#263238', '#CFD8DC'],
        data: [offer_cv ?? 7, target ?? 1],
      },
    ],
  };
  const dataOnboardRequest = {
    labels: ['Onboard', 'Yêu cầu'],
    datasets: [
      {
        backgroundColor: ['#263238', '#CFD8DC'],
        data: [onboard_cv ?? 7, target ?? 1],
      },
    ],
  };
  const dataOnboardOffer = {
    labels: ['Onboard', 'Offer'],
    datasets: [
      {
        backgroundColor: ['#263238', '#CFD8DC'],
        data: [onboard_cv ?? 7, offer_cv ?? 1],
      },
    ],
  };
  const ratioOfferReq = `${Math.round((offer_cv / target) * 100)}%`;
  const ratioOnboardReq = `${Math.round((onboard_cv / target) * 100)}%`;
  const ratioOnboardOffer = `${Math.round((onboard_cv / offer_cv) * 100)}%`;
  const plugins1 = [
    {
      beforeDraw: function (chart) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
        ctx.restore();
        var fontSize = (height / 160).toFixed(2);
        ctx.font = fontSize + 'em sans-serif';
        ctx.textBaseline = 'top';
        var text = ratioOfferReq,
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    },
  ];
  const plugins2 = [
    {
      beforeDraw: function (chart) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
        ctx.restore();
        var fontSize = (height / 160).toFixed(2);
        ctx.font = fontSize + 'em sans-serif';
        ctx.textBaseline = 'top';
        var text = ratioOnboardReq,
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    },
  ];
  const plugins3 = [
    {
      beforeDraw: function (chart) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
        ctx.restore();
        var fontSize = (height / 160).toFixed(2);
        ctx.font = fontSize + 'em sans-serif';
        ctx.textBaseline = 'top';
        var text = ratioOnboardOffer,
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    },
  ];
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
    <section className="statistic__subbinformation">
      <div className="statistic__subbinformation--item subinformation__item">
        <div className="item">
          <div className="item__title">
            <h4 className="statistic__chart--title chart">
              {t('statistic.offer_request')}
            </h4>
            <p className="chart--name">Statistic Subinformation</p>
          </div>
          <Dropdown overlay={menu} placement="bottomRight" arrow>
            <Button className="btn-function">
              <img src={Action} alt="action" />
            </Button>
          </Dropdown>
        </div>
        {offer_cv && (
          <DoughnutChart data={dataOfferRequest} plugins={plugins1} />
        )}
      </div>
      <div className="statistic__subbinformation--item subinformation__item">
        <div className="item">
          <div className="item__title">
            <h4 className="statistic__chart--title chart">
              {t('statistic.onboard_request')}
            </h4>
            <p className="chart--name">Statistic Subinformation</p>
          </div>
          <Dropdown overlay={menu} placement="bottomRight" arrow>
            <Button className="btn-function">
              <img src={Action} alt="action" />
            </Button>
          </Dropdown>
        </div>
        {onboard_cv && (
          <DoughnutChart data={dataOnboardRequest} plugins={plugins2} />
        )}
      </div>
      <div className="statistic__subbinformation--item subinformation__item">
        <div className="item">
          <div className="item__title">
            <h4 className="statistic__chart--title chart">
              {t('statistic.onboard_offer')}
            </h4>
            <p className="chart--name">Statistic Subinformation</p>
          </div>
          <Dropdown overlay={menu} placement="bottomRight" arrow>
            <Button className="btn-function">
              <img src={Action} alt="action" />
            </Button>
          </Dropdown>
        </div>
        {onboard_cv && (
          <DoughnutChart data={dataOnboardOffer} plugins={plugins3} />
        )}
      </div>
    </section>
  );
}

export default Request;
