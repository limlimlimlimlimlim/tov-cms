import axiosClient from '../util/axios-client';

export const getBuildingInfoTree = async () => {
  return await axiosClient.get('/building-info/tree');
};

export const getFloors = async () => {
  return await axiosClient.get('/building-info/floors');
};

export const getBuildingsByFloor = async (floorId: number) => {
  return await axiosClient.get(`/building-info/floor/${floorId}/buildings`);
};
