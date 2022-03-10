import { CV_URL } from '../constants/api';
import axiosClient from './axiosClient';

const typeworkApi = {
  getAll(params) {
    const url = CV_URL;
    return axiosClient.get(url, { params });
  },
  getById(cvId) {
    const url = CV_URL + `/${cvId}`;
    return axiosClient.get(url);
  },
  create(data) {
    const url = CV_URL;
    return axiosClient.post(url, data);
  },
  edit(cvId, data) {
    const url = CV_URL + `/${cvId}`;
    return axiosClient.put(url, data);
  },
  delete(cvId) {
    const url = CV_URL + `/${cvId}`;
    return axiosClient.delete(url);
  },
};
export default typeworkApi;
