import axiosClient from './axiosClient';
import { ONBOARD_URL } from '../constants/api';
const OnBoardCV = {
  getAll(params) {
    return axiosClient.get(ONBOARD_URL, { params });
  },

  post(data) {
    return axiosClient.post(ONBOARD_URL, data);
  },
  getById(id) {
    const url = `${ONBOARD_URL}/${id}`;
    return axiosClient.get(url);
  },
};
export default OnBoardCV;
