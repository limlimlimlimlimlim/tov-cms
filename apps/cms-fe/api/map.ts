import axiosClient from '../util/axios-client';

export const getMaps = async (param: {
  keyword;
  page;
  count;
  floor;
  building;
}) => {
  return await axiosClient.get(
    `/maps?keyword=${param.keyword}&page=${param.page}&count=${param.count}&floor=${param.floor}&building=${param.building}`,
  );
};

export const getMapDetail = async (id) => {
  return await axiosClient.get(`/maps/${id}`);
};

export const createMap = async (data) => {
  return await axiosClient.post('/maps', data);
};

export const updateMap = async (id, data) => {
  return await axiosClient.patch(`/maps/${id}`, data);
};

export const deleteMap = async (id) => {
  return await axiosClient.delete(`/maps/${id}`);
};
