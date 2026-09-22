import axios from 'axios';

export const axiosInstance = axios.create({
  withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
  config.params = {
    ...config.params,
    'ngrok-skip-browser-warning': 'true',
  };
  return config;
});
