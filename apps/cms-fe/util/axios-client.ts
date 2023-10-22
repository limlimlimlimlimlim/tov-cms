import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3001/",
});

axiosClient.interceptors.request.use((config) => {
  return config;
});

export default axiosClient;
