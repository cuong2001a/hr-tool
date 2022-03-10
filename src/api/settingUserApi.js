import { USERS_URL } from '../constants/api';
import axiosClient from './axiosClient';

export const settingUserApi = {
  getAll: (url, params) => {
    return axiosClient.get(url, { params });
  },
  addNew: (url, data) => {
    return axiosClient.post(url, data);
  },
  getById: (url, id) => {
    return axiosClient.get(`${url}/${id}`);
  },
  deleteData: (url, id) => {
    const byId = `${url}/${id}`;
    return axiosClient.delete(byId);
  },
  updateData: (url, id, data) => {
    const byId = `${url}/${id}`;
    return axiosClient.put(byId, data);
  },
};

export const settingUserApi2 = {
  getById: id => {
    return axiosClient.get(`${USERS_URL}/${id}`);
  },
};
