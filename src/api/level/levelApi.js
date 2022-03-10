import axiosClient from '../axiosClient';
import { API_LEVEL } from '../../constants/level';
export function getLevel(params) {
  return axiosClient.get(API_LEVEL, { params });
}

export function postLevel(data) {
  return axiosClient.post(API_LEVEL, data);
}

export function deleteLevel(id) {
  return axiosClient.delete(`${API_LEVEL}/${id}`);
}

export function updateLevel(id, data) {
  return axiosClient.put(`${API_LEVEL}/${id}`, data);
}

export function getLevelById(id) {
  return axiosClient.get(`${API_LEVEL}/${id})`);
}
export function DeleteLevel(data) {
  return axiosClient.delete(`${API_LEVEL}`, data);
}
