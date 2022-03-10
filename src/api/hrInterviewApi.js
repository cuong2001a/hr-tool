import axiosClient from './axiosClient';
import { HR_INTERVIEW } from '../constants/api';
const hrInterviewApi = {
  getByID(id) {
    return axiosClient.get(HR_INTERVIEW + `/${id}`);
  },
  post(data) {
    return axiosClient.post(HR_INTERVIEW, data);
  },
};
export default hrInterviewApi;
