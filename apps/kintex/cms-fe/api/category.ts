import axiosClient from '../util/axios-client';

export const getCategoryTree = async () => {
  return axiosClient.get('/facility-category/tree');
};

export const createCategory = async (data) => {
  return axiosClient.post('/facility-category/category', data);
};

export const createSubCategory = async (data) => {
  return axiosClient.post('/facility-category/sub-category', data);
};

export const getCategory = async () => {
  return axiosClient.get('/facility-category/categories');
};

export const getSubCategory = async (categoryId) => {
  return axiosClient.get(`/facility-category/category/${categoryId}/subs`);
};

export const deleteCategory = async (categoryId: string) => {
  return axiosClient.delete(`/facility-category/category/${categoryId}`);
};

export const deleteSubCateogy = async (subCategoryId: string) => {
  return axiosClient.delete(`/facility-category/sub-category/${subCategoryId}`);
};

export const updateCategory = async (categoryId: string, data) => {
  return axiosClient.patch(`/facility-category/category/${categoryId}`, data);
};

export const updateSubCateogy = async (floorId: string, data) => {
  return axiosClient.patch(`/facility-category/sub-category/${floorId}`, data);
};
