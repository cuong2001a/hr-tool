import qs from 'query-string';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { DEFAULT_PARAMS } from '../../constants';
import FilterFormGeneral from './FilterFormGeneral';
import TableGeneral from './TableGeneral';
function Plan(props) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navi = useNavigate();
  const queryParams = qs.parse(location.search);
  const [filter, setFilter] = useState({});
  useEffect(() => {
    setFilter({ ...DEFAULT_PARAMS, ...queryParams });
  }, []);
  useEffect(() => {
    navi({
      pathname: window.location.pathname,
      search: qs.stringify(filter),
    });
  }, [navi, filter]);
  return (
    <main className="plan">
      <div className="plan__header">
        <h1 className="plan__header--title">{t('plan.plan')}</h1>
        <FilterFormGeneral filter={filter} setFilter={setFilter} />
      </div>
      <TableGeneral filter={filter} setFilter={setFilter} />
    </main>
  );
}

export default Plan;
