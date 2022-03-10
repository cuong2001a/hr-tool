import { TO_INTERVIEW } from '../constants/api';
import axiosClient from './axiosClient';

const toInterviewApi = {
  getById(id) {
    return axiosClient.get(TO_INTERVIEW + `/${id}`);
  },
  post(data) {
    return axiosClient.post(TO_INTERVIEW, data);
  },
};

export default toInterviewApi;
