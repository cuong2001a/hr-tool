import { Button, message } from 'antd';
import qs from 'query-string';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import dashboardApi from '../../api/dashboardApi';
import {
  setListData,
  setListDataDepartment,
  setListDataSummary,
} from '../../app/dashboard-reducer';
import FilterForm from '../../components/Filter-Dashboard/FilterForm';
import NewRequest from './new-request';
import RecruitmentPerMonth from './recruitment-per-month';
import Report from './report';
import Request from './request';
import Summary from './summary';
function Statistic() {
  const location = useLocation();
  const navi = useNavigate();
  const queryParams = qs.parse(location.search);
  const [filter, setFilter] = useState({
    year: queryParams.year || new Date().getFullYear(),
    month: queryParams.month || new Date().getMonth() + 1,
    ...queryParams,
  });
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    let unmount = false;
    dashboardApi
      .getDataTable(filter)
      .then(resp => {
        if (resp.data.status === 'success') {
          if (unmount === false) {
            dispatch(setListData(resp.data.data));
            dispatch(setListDataSummary(resp.data.summary));
            dispatch(setListDataDepartment(resp.data.department));
          }
        }
      })
      .catch(e => {
        message.error(e);
      });
    return () => {
      unmount = true;
    };
  }, [filter]);
  useEffect(() => {
    navi({
      pathname: window.location.pathname,
      search: qs.stringify(filter),
    });
  }, [navi, filter]);
  return (
    <main className="statistic">
      <div className="statistic__header">
        <h1 className="statistic__title">{t('statistic.statistic')}</h1>
        <Button type="primary" className="statistic__header--add">
          {t('statistic.add_chart')}
        </Button>
      </div>
      <FilterForm setFilter={setFilter} filter={filter} />
      <Summary />
      <div className="statistic__bar">
        <h4 className="statistic__chart--title chart">
          {t('statistic.request_recruitment_success')}
        </h4>
        <RecruitmentPerMonth />
      </div>
      {/* <Request /> */}
      <NewRequest />
      <Report />
    </main>
  );
}

export default Statistic;
