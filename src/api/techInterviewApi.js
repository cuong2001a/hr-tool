import axiosClient from './axiosClient';
import { TECH_INTERVIEW } from '../constants/api';

const techInterviewApi = {
  getById(id) {
    return axiosClient.get(TECH_INTERVIEW + `/${id}`);
  },
  post(data) {
    return axiosClient.post(TECH_INTERVIEW, data);
  },
};

export default techInterviewApi;
