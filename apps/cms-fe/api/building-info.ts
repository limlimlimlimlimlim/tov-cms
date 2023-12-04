import axiosClient from '../util/axios-client';

export const getBuildingInfoTree = async () => {
  return axiosClient.get('/building-info/tree');
};

export const createWing = async (data) => {
  return axiosClient.post('/building-info/wing', data);
};

export const createFloor = async (data) => {
  console.log(data);
  return axiosClient.post('/building-info/floor', data);
};

export const getFloors = async () => {
  return axiosClient.get('/building-info/floors');
};

export const getFloorsInWing = async (wingId: string) => {
  return axiosClient.get(`/building-info/wing/${wingId}/floors`);
};

export const getWings = async () => {
  return axiosClient.get(`/building-info/wings`);
};

export const getWingsInFloor = async (floorId: string) => {
  return axiosClient.get(`/building-info/floor/${floorId}/wings`);
};

export const deleteFloor = async (floorId: string) => {
  return axiosClient.delete(`/building-info/floor/${floorId}`);
};

export const deleteWing = async (wingId: string) => {
  return axiosClient.delete(`/building-info/wing/${wingId}`);
};

export const updateWing = async (wingId: string, data) => {
  return axiosClient.patch(`/building-info/wing/${wingId}`, data);
};

export const updateFloor = async (floorId: string, data) => {
  return axiosClient.patch(`/building-info/floor/${floorId}`, data);
};
