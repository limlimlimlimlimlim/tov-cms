import axios from 'axios';

let baseURL = '';
const axiosClient = axios.create();

axiosClient.interceptors.request.use((config) => {
  return config;
});

const setToken = (token: string) => {
  axiosClient.defaults.headers.common.Authorization = token;
};

const setBaseUrl = (url: string) => {
  baseURL = url;
  axiosClient.defaults.baseURL = url;
};

const getBaseUrl = () => {
  return baseURL;
};

export default axiosClient;
export { setToken, setBaseUrl, getBaseUrl };
