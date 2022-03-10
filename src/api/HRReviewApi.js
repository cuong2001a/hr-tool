import axiosClient from './axiosClient';
import { REVIEW_HR_URL } from '../constants/api';
const HRReviewApi = {
  getAll(params) {
    return axiosClient.get(REVIEW_HR_URL, { params });
  },
  post(data) {
    return axiosClient.post(REVIEW_HR_URL, data);
  },
  getById(id) {
    const url = `${REVIEW_HR_URL}/${id}`;
    return axiosClient.get(url);
  },
};
export default HRReviewApi;
