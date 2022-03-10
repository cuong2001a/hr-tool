import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DEFAULT_PAGENUMBER,
  DEFAULT_PAGESIZE,
} from '../../constants/requestPage';
import RequestForm from './components/RequestForm';
import RequestHeader from './components/RequestHeader';
import SearchForm from './components/SearchForm';
import RequestTable from './components/Table';
import queryString from 'query-string';

function Request() {
  const location = useLocation();
  const navigate = useNavigate();

  const [titleForm, setTitleForm] = useState('');
  const [titleButtonForm, setTitleButtonForm] = useState('');
  const [listParams, setListParams] = useState(() => {
    const paramsObj = queryString.parse(location.search);

    return {
      limit: paramsObj.limit || DEFAULT_PAGESIZE,
      page: paramsObj.page || DEFAULT_PAGENUMBER,
      priority: paramsObj?.priority || '',
      keyword: paramsObj?.keyword || '',
      level_id: paramsObj?.level_id || '',
      position_id: paramsObj?.position_id || '',
      requestor_id: paramsObj?.requestor_id || '',
      status: paramsObj?.status || '',
    };
  });

  useEffect(() => {
    navigate({
      pathname: location.pathname,
      search: queryString.stringify(listParams, {
        skipNull: true,
        skipEmptyString: true,
      }),
    });
  }, [listParams]);

  return (
    <section className="request">
      <RequestHeader
        onChangeTitleForm={setTitleForm}
        onChangeTitleButtonForm={setTitleButtonForm}
      />
      <SearchForm onChangeListParams={setListParams} listParams={listParams} />
      <RequestTable
        listParams={listParams}
        onChangeListParams={setListParams}
        onChangeTitleForm={setTitleForm}
        onChangeTitleButtonForm={setTitleButtonForm}
      />
      <RequestForm titleForm={titleForm} titleButtonForm={titleButtonForm} />
    </section>
  );
}

export default Request;
