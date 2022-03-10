import { POSITION_URL } from '../constants/api';
import axiosClient from './axiosClient';
export const positionApi = {
  getPositionByPage(params) {
    return axiosClient.get(POSITION_URL, { params });
  },
  getAllPosition(params) {
    return axiosClient.get(POSITION_URL, { params });
  },
  getPositionById(id) {
    const url = `${POSITION_URL}/${id}`;
    return axiosClient.get(url);
  },
  postPosition(data) {
    return axiosClient.post(POSITION_URL, data);
  },
  putPosition(data) {
    const url = `${POSITION_URL}/${data.id}`;
    return axiosClient.put(url, data);
  },
  deletePositionById(id) {
    const url = `${POSITION_URL}/${id}`;
    return axiosClient.delete(url);
  },
  deletePosition(data) {
    console.log(data);
    return axiosClient.delete(POSITION_URL, data);
  },
};
