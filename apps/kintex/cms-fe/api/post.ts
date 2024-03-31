import axiosClient from '../util/axios-client';

export const getPosts = async (param: {
  keyword;
  page;
  count;
  startDate;
  endDate;
  sortFiled;
  sortOrder;
}) => {
  const query = new URLSearchParams(param);
  return axiosClient.get(`/post?${query}`);
};

export const getPostByOrder = async (order) => {
  return axiosClient.get(`/post/order/${order}`);
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

export const updatePostOrder = async (id, data) => {
  return axiosClient.patch(`/post/${id}/order`, data);
};

export const deletePost = async (id) => {
  return axiosClient.delete(`/post/${id}`);
};

export const incrementPostOrder = async (id) => {
  return axiosClient.patch(`/post/order/increment/${id}`);
};

export const decrementPostOrder = async (id) => {
  return axiosClient.patch(`/post/order/decrement/${id}`);
};
