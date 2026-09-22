import axios from 'axios';

export const axiosInstance = axios.create({
  // додав для ngrok
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
  withCredentials: true,
});
