import axiosClient from '../util/axios-client';

export const getMaps = async (param: { keyword; page; count; floor; wing }) => {
  return axiosClient.get(
    `/maps?keyword=${param.keyword}&page=${param.page}&count=${param.count}&floor=${param.floor}&wing=${param.wing}`,
  );
};

export const getMapByWingAndFloor = async (param: { floor; wing }) => {
  return axiosClient.get(`/maps?floor=${param.floor}&wing=${param.wing}`);
};

export const getMapDetail = async (id) => {
  return axiosClient.get(`/maps/${id}`);
};

export const createMap = async (data) => {
  return axiosClient.post('/maps', data);
};

export const updateMap = async (id, data) => {
  return axiosClient.patch(`/maps/${id}`, data);
};

export const deleteMap = async (id) => {
  return axiosClient.delete(`/maps/${id}`);
};
