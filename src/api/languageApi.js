import { LANG_URL } from '../constants/api';
import axiosClient from './axiosClient';

const languageApi = {
  getAll(params) {
    const url = LANG_URL;
    return axiosClient.get(url, { params });
  },
  getById(languageId) {
    const url = LANG_URL + `/${languageId}`;
    return axiosClient.get(url);
  },
  create(data) {
    const url = LANG_URL;
    return axiosClient.post(url, data);
  },
  edit(languageId, data) {
    const url = LANG_URL + `/${languageId}`;
    return axiosClient.put(url, data);
  },
  delete(languageId) {
    const url = LANG_URL + `/${languageId}`;
    return axiosClient.delete(url);
  },
};
export default languageApi;
