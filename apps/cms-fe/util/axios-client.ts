import axios from 'axios';

const baseURL = `${window.location.protocol}://${window.location.hostname}:3001`;
const axiosClient = axios.create({
  baseURL,
});

axiosClient.interceptors.request.use((config) => {
  return config;
});

const setToken = (token: string) => {
  axiosClient.defaults.headers.common.Authorization = token;
};

export default axiosClient;
export { baseURL, setToken };
