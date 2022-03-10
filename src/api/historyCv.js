import { CV_HISTORY } from '../constants/api';
import axiosClient from './axiosClient';

export function getHistoryCv(params) {
  return axiosClient.get(CV_HISTORY, { params });
}

export function updateHistoryCv(id, data) {
  return axiosClient.put(`${CV_HISTORY} / ${id}`, data);
}
