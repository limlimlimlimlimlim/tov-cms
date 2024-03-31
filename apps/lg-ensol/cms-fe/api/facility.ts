import axiosClient from '../util/axios-client';

export const getFacilities = async (param: {
  keyword;
  page;
  count;
  floor;
  wing;
}) => {
  return axiosClient.get(
    `/facility?keyword=${param.keyword}&page=${param.page}&count=${param.count}&floorId=${param.floor}&wingId=${param.wing}`,
  );
};

export const getFacilityAll = async () => {
  return axiosClient.get('/facility/all');
};

export const getFacilityDetail = async (id) => {
  return axiosClient.get(`/facility/${id}`);
};

export const createFacility = async (data) => {
  return axiosClient.post('/facility', data);
};

export const updateFacility = async (id, data) => {
  return axiosClient.patch(`/facility/${id}`, data);
};

export const deleteFacility = async (id) => {
  return axiosClient.delete(`/facility/${id}`);
};
