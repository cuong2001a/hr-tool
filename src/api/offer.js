import axiosClient from './axiosClient';
import { OFFER_URL } from '../constants/api';
const OfferCV = {
  getAll(params) {
    return axiosClient.get(OFFER_URL, { params });
  },

  post(data) {
    return axiosClient.post(OFFER_URL, data);
  },
  getById(id) {
    const url = `${OFFER_URL}/${id}`;
    return axiosClient.get(url);
  },
};
export default OfferCV;
