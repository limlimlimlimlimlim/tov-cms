import axiosClient from '../util/axios-client';

export const login = async (data: { userId; password }) => {
  return axiosClient.post('auth/login', data);
};

export const verifyToken = async (token) => {
  return axiosClient.post('auth/verify-token', { token });
};
