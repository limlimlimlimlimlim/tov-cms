import axiosClient from '../util/axios-client';

export const getSchedules = async (param: {
  keyword;
  page;
  count;
  startDate;
  endDate;
  sortFiled;
  sortOrder;
}) => {
  const query = new URLSearchParams(param);
  return axiosClient.get(`/schedule?${query}`);
};

export const getScheduleByOrder = async (order) => {
  return axiosClient.get(`/schedule/order/${order}`);
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

export const updateScheduleOrder = async (id, data) => {
  return axiosClient.patch(`/schedule/${id}/order`, data);
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
