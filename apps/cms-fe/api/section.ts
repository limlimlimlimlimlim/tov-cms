import axiosClient from '../util/axios-client';

export const addSection = async (mapId, path) => {
  return axiosClient.post('/section', { mapId, path });
};

export const getSectionsByMapId = async (mapId) => {
  return axiosClient.get(`/section/map/${mapId}`);
};

export const deleteSectionById = async (sectionId) => {
  return axiosClient.delete(`/section/${sectionId}`);
};

export const updateSectionById = async (sectionId, mapId, path) => {
  return axiosClient.patch(`/section/${sectionId}`, { mapId, path });
};
