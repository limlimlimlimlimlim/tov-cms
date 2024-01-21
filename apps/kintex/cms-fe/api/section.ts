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

export const updateSectionPaintOptionById = async (sectionId, options) => {
  return axiosClient.patch(`/section/paint/${sectionId}`, options);
};

export const disableSectionById = async (sectionId) => {
  return axiosClient.patch(`/section/${sectionId}`, { disabled: true });
};

export const enableSectionById = async (sectionId) => {
  return axiosClient.patch(`/section/${sectionId}`, { disabled: false });
};

export const createSectionGroup = async (sectionIds: string[]) => {
  return axiosClient.post(`/section/group`, { sectionIds });
};

export const deleteSectionGroup = async (groupId: string) => {
  return axiosClient.delete(`/section/group/${groupId}`);
};
