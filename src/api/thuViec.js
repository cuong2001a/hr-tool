import axiosClient from './axiosClient';
import { PROBATION_URL } from '../constants/api';
const probationApi = {
  getAll(params) {
    return axiosClient.get(PROBATION_URL, { params });
  },

  post(data) {
    return axiosClient.post(PROBATION_URL, data);
  },
  getById(id) {
    const url = `${PROBATION_URL}/${id}`;
    return axiosClient.get(url);
  },
};
export default probationApi;
