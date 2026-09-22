import axios from 'axios';

export const axiosInstance = axios.create({
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
  withCredentials: true,
});
