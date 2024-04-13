import axiosClient from '../util/axios-client';

export const getKiosks = async () => {
  return axiosClient.get(`/monitoring`);
};

export const resetMonitoring = async () => {
  return axiosClient.post(`/monitoring/reset`);
};
