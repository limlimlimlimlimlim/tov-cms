import axiosClient from '../util/axios-client';

export const getSchedules = async (param: { keyword; page; count }) => {
  return axiosClient.get(
    `/schedule?keyword=${param.keyword}&page=${param.page}&count=${param.count}`,
  );
};

export const getScheduleDetail = async (id) => {
  return axiosClient.get(`/schedule/${id}`);
};

export const createSchedule = async (data) => {
  return axiosClient.post('/schedule', data);
};

export const updateSchedule = async (id, data) => {
  return axiosClient.patch(`/schedule/${id}`, data);
};

export const deleteSchedule = async (id) => {
  return axiosClient.delete(`/schedule/${id}`);
};

export const incrementScheduleOrder = async (id) => {
  return axiosClient.patch(`/schedule/order/increment/${id}`);
};

export const decrementScheduleOrder = async (id) => {
  return axiosClient.patch(`/schedule/order/decrement/${id}`);
};
