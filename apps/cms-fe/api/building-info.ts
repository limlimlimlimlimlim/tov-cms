import axiosClient from '../util/axios-client';

export const getBuildingInfoTree = async () => {
  return axiosClient.get('/building-info/tree');
};

export const getFloors = async () => {
  return axiosClient.get('/building-info/floors');
};

export const getWingsInFloor = async (floorId: number) => {
  return axiosClient.get(`/building-info/floor/${floorId}/wings`);
};

export const deleteFloor = async (floorId: number) => {
  return axiosClient.delete(`/building-info/floor/${floorId}`);
};

export const deleteWing = async (wingId: number) => {
  return axiosClient.delete(`/building-info/building/${wingId}`);
};
