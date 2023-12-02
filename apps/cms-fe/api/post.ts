import axiosClient from '../util/axios-client';

export const getPosts = async (param: {
  keyword;
  page;
  count;
  floor;
  wing;
}) => {
  return axiosClient.get(
    `/post?keyword=${param.keyword}&page=${param.page}&count=${param.count}&floorId=${param.floor}&wingId=${param.wing}`,
  );
};

export const getPostDetail = async (id) => {
  return axiosClient.get(`/post/${id}`);
};

export const createPost = async (data) => {
  return axiosClient.post('/post', data);
};

export const updatePost = async (id, data) => {
  return axiosClient.patch(`/post/${id}`, data);
};

export const deletePost = async (id) => {
  return axiosClient.delete(`/post/${id}`);
};
