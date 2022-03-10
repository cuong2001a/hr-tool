import axiosClient from './axiosClient';
import { REVIEW_CV_URL } from '../constants/api';
const CVReviewApi = {
  getAll(params) {
    return axiosClient.get(REVIEW_CV_URL, { params });
  },
  post(data) {
    return axiosClient.post(REVIEW_CV_URL, data);
  },
  getById(id) {
    const url = `${REVIEW_CV_URL}/${id}`;
    return axiosClient.get(url);
  },
};
export default CVReviewApi;
