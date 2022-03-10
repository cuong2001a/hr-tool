import axiosClient from '../api/axiosClient';
import { DASHBOARD_API, LEVEL_API, POSITION_API } from '../constants/api';

const dashboardApi = {
  getDataTable(payload) {
    const position = payload.position ? `&position_id=${payload.position}` : '';
    const level = payload.level ? `&level_id=${payload.level}` : '';
    const url = `${DASHBOARD_API}?year=${payload.year ?? ''}&month=${
      payload.month ?? ''
    }${position}${level}`;
    return axiosClient.get(url);
  },
  getFilterPositions(payload) {
    const url = `${POSITION_API}?status=1&limit=${payload.limit}`;

    return axiosClient.get(url);
  },
  getLevelFilter(payload) {
    const url = `${LEVEL_API}?status=1&limit=${payload.limit}`;

    return axiosClient.get(url);
  },
};
export default dashboardApi;
