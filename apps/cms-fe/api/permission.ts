import axiosClient from '../util/axios-client';

export const getPermissions = async (param: { page; count }) => {
  return axiosClient.get(`/permission?page=${param.page}&count=${param.count}`);
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
