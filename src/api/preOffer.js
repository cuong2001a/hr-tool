import axiosClient from './axiosClient';
import { PREOFFER_URL } from '../constants/api';
const PreOfferCV = {
  getAll(params) {
    return axiosClient.get(PREOFFER_URL, { params });
  },

  post(data) {
    return axiosClient.post(PREOFFER_URL, data);
  },
  getById(id) {
    const url = `${PREOFFER_URL}/${id}`;
    return axiosClient.get(url);
  },
};
export default PreOfferCV;
