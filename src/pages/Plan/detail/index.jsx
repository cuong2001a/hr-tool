import qs from 'query-string';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { DEFAULT_PARAMS } from '../../../constants';
import FilterForm from './FilterForm';
import TableReport from './TableReport';
function PlanDetail(props) {
  const { t, i18n } = useTranslation();
  const navi = useNavigate();
  const location = useLocation();
  const queryParams = qs.parse(location.search);
  const [filterDetail, setFilterDetail] = useState({
    ...DEFAULT_PARAMS,
    ...queryParams,
  });
  useEffect(() => {
    navi({
      pathname: window.location.pathname,
      search: qs.stringify(filterDetail),
    });
  }, [filterDetail]);
  return (
    <main className="plan">
      <div className="plan__header">
        <h1 className="plan__header--title">{t('plan.plan')}</h1>
        <FilterForm
          filterDetail={filterDetail}
          setFilterDetail={setFilterDetail}
        />
      </div>
      <TableReport
        filterDetail={filterDetail}
        setFilterDetail={setFilterDetail}
      />
    </main>
  );
}

export default PlanDetail;
