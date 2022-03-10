import axiosClient from './axiosClient';
import { REVIEW_PHYSIOGNOMY1_URL } from '../constants/api';
const PhysiognomyReviewApi = {
  getAll(params) {
    return axiosClient.get(REVIEW_PHYSIOGNOMY1_URL, { params });
  },

  post(data) {
    return axiosClient.post(REVIEW_PHYSIOGNOMY1_URL, data);
  },
  getById(id) {
    const url = `${REVIEW_PHYSIOGNOMY1_URL}/${id}`;
    return axiosClient.get(url);
  },
};
export default PhysiognomyReviewApi;
