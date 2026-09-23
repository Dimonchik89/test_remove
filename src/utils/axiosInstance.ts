import axios from 'axios';

export const axiosInstance = axios.create({
  //   headers: {
  //     'ngrok-skip-browser-warning': 'true',
  //   },
  //   withCredentials: true,
});

// axiosInstance.interceptors.request.use(config => {
//   config.params = {
//     ...config.params,
//     'ngrok-skip-browser-warning': 'true',
//   };
//   return config;
// });
