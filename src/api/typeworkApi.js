import { TYPE_WORK_URL } from '../constants/api';
import axiosClient from './axiosClient';

const typeworkApi = {
  getAll(params) {
    const url = TYPE_WORK_URL;
    return axiosClient.get(url, { params });
  },
  getById(typeworkId) {
    const url = TYPE_WORK_URL + `/${typeworkId}`;
    return axiosClient.get(url);
  },
  create(data) {
    const url = TYPE_WORK_URL;
    return axiosClient.post(url, data);
  },
  edit(typeworkId, data) {
    const url = TYPE_WORK_URL + `/${typeworkId}`;
    return axiosClient.put(url, data);
  },
  delete(typeworkId) {
    const url = TYPE_WORK_URL + `/${typeworkId}`;
    return axiosClient.delete(url);
  },
};
export default typeworkApi;
