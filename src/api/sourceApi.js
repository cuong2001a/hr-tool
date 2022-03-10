import axiosClient from './axiosClient';
import { SOURCE_API } from '../constants/api';
const sourceApi = {
  getAll(params) {
    return axiosClient.get(SOURCE_API, { params });
  },
  put(id, data) {
    return axiosClient.put(SOURCE_API + `/${id}`, data);
  },
  post(data) {
    return axiosClient.post(SOURCE_API, data);
  },
  delete(id) {
    return axiosClient.delete(SOURCE_API + `/${id}`);
  },
};

export default sourceApi;
