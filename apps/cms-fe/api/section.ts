import axiosClient from '../util/axios-client';

export const addSection = async (mapId, path) => {
  return axiosClient.post('/section', { mapId, path });
};

export const getSectionsByMapId = async (mapId) => {
  return axiosClient.get(`/section/map/${mapId}`);
};

export const deleteSectionById = async (id) => {
  return axiosClient.delete(`/section/${id}`);
};
