import axios from 'axios';

export const baseURL = 'http://localhost:3001';

const axiosClient = axios.create({
  baseURL,
});

axiosClient.interceptors.request.use((config) => {
  return config;
});

export default axiosClient;
