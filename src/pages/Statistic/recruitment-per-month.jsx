import { Bar } from 'react-chartjs-2';
import AnnBarChart from '../../assets/images/statistic/Bar-blue.svg';
import AnnBarChart1 from '../../assets/images/statistic/Bar-blue-opa.svg';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BarChart from './bar-chart';

function RecruitmentPerMonth() {
  const { t, i18n } = useTranslation();

  return (
    <section className="chart__bar--detail">
      <div className="detail__wrapper">
        <div className="detail">
          <BarChart />
        </div>
      </div>
      <div className="chart__bar--annotation">
        <div className="annotation">
          <img src={AnnBarChart1} alt="annotation" />
          {t('statistic.request')}
        </div>
        <div className="annotation">
          <img src={AnnBarChart} alt="annotation" />
          {t('statistic.recruit_successfully')}
        </div>
      </div>
    </section>
  );
}

export default RecruitmentPerMonth;
