import axiosClient from '../util/axios-client';

export const addSection = async (mapId, path) => {
  return axiosClient.post('/section', { mapId, path });
};
