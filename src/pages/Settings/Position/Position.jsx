import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PositionFilter from './components/Filter';
import FormDepartment from './components/FormDepartment';
import FormPosition from './components/FormPosition';
import PositionHeader from './components/Header';
import PositionTable from './components/Table';
import queryString from 'query-string';
import {
  DEFAULT_PAGENUMBER,
  DEFAULT_PAGESIZE,
} from '../../../constants/languagePage';
import { convertArrayToParamsWithDash } from '../../../utils/convertArrayToParamsWithDash';
import { useDispatch, useSelector } from 'react-redux';
import { LIMIT_DEFAULT } from '../../../constants/position';
import { DEFAULT_STATUS } from '../../../constants';
import { positionApi } from '../../../api/positionApi';
import {
  filterDepartment,
  filterManager,
  filterRequestor,
  setTotalPosition,
} from './reducer';
import { settingUserApi } from '../../../api/settingUserApi';
import { USER_URL } from '../../../constants/api';
function Position(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { totalPosition } = useSelector(item => item.position);
  const [formBtnTitle, setFormBtnTitle] = useState('');
  const [formTilte, setFormTitle] = useState('');
  const searchParams = queryString.parse(location.search);
  const [isEdit, setIsEdit] = useState(false);
  const [listParams, setListParams] = useState(() => {
    return {
      limit: DEFAULT_PAGESIZE,
      page: DEFAULT_PAGENUMBER,
      orderby: 'id-DESC',
      ...searchParams,
    };
  });
  const getAllPosition = async () => {
    const { data } = await positionApi.getAllPosition(listParams);
    dispatch(setTotalPosition(data.total));
  };
  const getFilterAll = async () => {
    try {
      const item = {
        limit: LIMIT_DEFAULT,
        page: '',
        key: '',
        status: DEFAULT_STATUS,
        column: '',
      };
      const { data: deparment } = await positionApi.getAllPosition(item);
      const { data } = await settingUserApi.getAll(USER_URL, item);
      dispatch(filterDepartment(deparment.data));
      dispatch(filterManager(data.data));
      dispatch(filterRequestor(data.data));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllPosition();
  }, []);
  useEffect(() => {
    getFilterAll();
  }, []);
  useEffect(() => {
    let unMounted = false;
    const newParams = { ...listParams };
    convertArrayToParamsWithDash(newParams);
    if (!unMounted) {
      navigate({
        pathname: location.pathname,
        search: queryString.stringify(newParams, {
          skipNull: true,
          skipEmptyString: true,
        }),
      });
    }
    return () => {
      unMounted = true;
    };
  }, [listParams]);
  return (
    <div className="position">
      <PositionHeader
        setFormBtnTitle={setFormBtnTitle}
        setFormTitle={setFormTitle}
        setIsEdit={setIsEdit}
      />
      <PositionFilter
        listParams={listParams}
        onChangeListParams={setListParams}
      />
      <PositionTable
        setFormBtnTitle={setFormBtnTitle}
        setFormTitle={setFormTitle}
        formTilte={formTilte}
        listParams={listParams}
        setIsEdit={setIsEdit}
        onChangeListParams={setListParams}
      />
      <FormPosition
        formBtnTitle={formBtnTitle}
        formTilte={formTilte}
        isEdit={isEdit}
      />
      <FormDepartment />
    </div>
  );
}

export default Position;
