import axiosClient from '../api/axiosClient';
import {
  PLAN_URL,
  REQUEST_URL,
  USER_URL,
  TYPE_WORK_URL,
  SOURCE_API,
} from '../constants/api';
const planApi = {
  getDataTablePlan(params) {
    const month = params.month ? `month=${params.month}` : '';
    const year = params.year ? `&year=${params.year}` : '';
    const url = `${PLAN_URL}?${month}${year}&limit=${params.limit}&page=${params.page}`;
    return axiosClient.get(url);
  },
  getTableDetail(payload) {
    const month = payload.month ? `&month=${payload.month}` : '';
    const year = payload.year ? `&year=${payload.year}` : '';
    const position = payload.position_id
      ? `&position_id=${payload.position_id}`
      : '';
    const requestor = payload.requestor_id
      ? `&requestor_id=${payload.requestor_id}`
      : '';
    const level = payload.level_id ? `&level_id=${payload.level_id}` : '';
    const priority = payload.priority ? `&priority=${payload.priority}` : '';
    const assignee = payload.assignee_id
      ? `&assignee_id=${payload.assignee_id}`
      : '';
    const key = payload.keyword ? `&keyword=${payload.keyword}` : '';
    const url = `${REQUEST_URL}?limit=${payload.limit}&page=${payload.page}&status=2${month}${year}${position}${requestor}${level}${priority}${assignee}${key}`;
    return axiosClient.get(url);
  },
  getUserFilter(params) {
    const url = `${USER_URL}?status=1&limit=${params.limit}`;
    return axiosClient.get(url);
  },
  getTypework(params) {
    const url = `${TYPE_WORK_URL}?limit=${params.limit}`;
    return axiosClient.get(url);
  },
  fixPlan(id, payload) {
    const url = `${REQUEST_URL}/${id}`;
    return axiosClient.put(url, payload);
  },
  getDataSource(params) {
    const url = `${SOURCE_API}?status=1&limit=${params.limit}`;
    return axiosClient.get(url);
  },
};
export default planApi;
