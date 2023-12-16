import axiosClient from '../util/axios-client';

export const getPermissions = async () => {
  return axiosClient.get('/permission');
};

export const getPermissionDetail = async (id) => {
  return axiosClient.get(`/permission/${id}`);
};

export const createPermission = async (data) => {
  return axiosClient.post('/permission', data);
};

export const updatePermission = async (id, data) => {
  return axiosClient.patch(`/permission/${id}`, data);
};

export const deletePermission = async (id) => {
  return axiosClient.delete(`/permission/${id}`);
};
