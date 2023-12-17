import axiosClient from '../util/axios-client';

export const getUsers = async (param: { keyword; page; count }) => {
  return axiosClient.get(
    `/user?keyword=${param.keyword}&page=${param.page}&count=${param.count}`,
  );
};

export const getUserDetail = async (id) => {
  return axiosClient.get(`/user/${id}`);
};

export const createUser = async (data) => {
  return axiosClient.post('/user', data);
};

export const updateUser = async (id, data) => {
  return axiosClient.patch(`/user/${id}`, data);
};

export const deleteUser = async (id) => {
  return axiosClient.delete(`/user/${id}`);
};
