import axiosClient from '../util/axios-client';

export const getKiosks = async (param: {
  keyword;
  page;
  count;
  floor;
  wing;
}) => {
  return axiosClient.get(
    `/kiosk?keyword=${param.keyword}&page=${param.page}&count=${param.count}&floorId=${param.floor}&wingId=${param.wing}`,
  );
};

export const getKioskByCode = async (code) => {
  return axiosClient.get(`/kiosk/code/${code}`);
};

export const getKioskDetail = async (id) => {
  return axiosClient.get(`/kiosk/${id}`);
};

export const createKiosk = async (data) => {
  return axiosClient.post('/kiosk', data);
};

export const updateKiosk = async (id, data) => {
  return axiosClient.patch(`/kiosk/${id}`, data);
};

export const deleteKiosk = async (id) => {
  return axiosClient.delete(`/kiosk/${id}`);
};
