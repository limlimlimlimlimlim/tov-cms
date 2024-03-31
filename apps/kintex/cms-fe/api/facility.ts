import axiosClient from '../util/axios-client';

export const getFacilities = async (param: {
  keyword;
  page;
  count;
  floor;
  wing;
  startDate;
  endDate;
  sortFiled;
  sortOrder;
}) => {
  const query = new URLSearchParams(param);
  return axiosClient.get(`/facility?${query}`);
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
