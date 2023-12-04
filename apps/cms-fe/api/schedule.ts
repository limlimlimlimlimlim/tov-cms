import axiosClient from '../util/axios-client';

export const getSchedules = async (param: { keyword; page; count; wing }) => {
  return axiosClient.get(
    `/schedule?keyword=${param.keyword}&page=${param.page}&count=${param.count}&wingId=${param.wing}`,
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
