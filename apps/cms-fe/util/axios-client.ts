import axios from 'axios';

const baseURL =
  (process as any).env.NODE_ENV == 'production'
    ? 'http://43.201.126.225:3001'
    : 'http://localhost:3001';

const axiosClient = axios.create({
  baseURL,
});

axiosClient.interceptors.request.use((config) => {
  return config;
});

export default axiosClient;
export { baseURL };
