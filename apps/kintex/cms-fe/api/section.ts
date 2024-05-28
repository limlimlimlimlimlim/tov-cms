import axiosClient from '../util/axios-client';

export const addSection = (mapId, path) => {
  return axiosClient.post('/section', { mapId, path });
};

export const getSectionsByMapId = (mapId) => {
  return axiosClient.get(`/section/map/${mapId}`);
};

export const deleteSectionById = (sectionId) => {
  return axiosClient.delete(`/section/${sectionId}`);
};

export const updateSectionById = (sectionId, mapId, path) => {
  return axiosClient.patch(`/section/${sectionId}`, { mapId, path });
};

export const updateSectionPaintOptionById = (sectionId, options) => {
  return axiosClient.patch(`/section/paint/${sectionId}`, options);
};

export const disableSectionById = (sectionId) => {
  return axiosClient.patch(`/section/${sectionId}`, { disabled: true });
};

export const enableSectionById = (sectionId) => {
  return axiosClient.patch(`/section/${sectionId}`, { disabled: false });
};

export const createSectionGroup = (sectionIds: string[]) => {
  return axiosClient.post(`/section/group`, { sectionIds });
};

export const deleteSectionGroup = (groupId: string) => {
  return axiosClient.delete(`/section/group/${groupId}`);
};
