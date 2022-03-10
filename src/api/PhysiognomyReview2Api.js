import axiosClient from './axiosClient';
import { REVIEW_PHYSIOGNOMY2_URL } from '../constants/api';
const PhysiognomyReview2Api = {
  getAll(params) {
    return axiosClient.get(REVIEW_PHYSIOGNOMY2_URL, { params });
  },

  post(data) {
    return axiosClient.post(REVIEW_PHYSIOGNOMY2_URL, data);
  },
  getById(id) {
    const url = `${REVIEW_PHYSIOGNOMY2_URL}/${id}`;
    return axiosClient.get(url);
  },
};
export default PhysiognomyReview2Api;
