import axios from 'axios';

// const BACKEND_BASE = 'http://localhost:5000';
const BACKEND_BASE = 'https://gnomies.fi';

const instance = axios.create({
  baseURL: BACKEND_BASE,
  timeout: 31000,
});

instance.interceptors.request.use(
  (config) => {
    const walletLS = localStorage.getItem('wallet') || null;

    if (walletLS) {
      const wallet = JSON.parse(walletLS);
      config.headers.Authorization = `Bearer ${wallet.accessToken || null}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;
