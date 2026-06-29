import axios from 'axios';

const api = axios.create({
  baseURL: 'https://memegenerator-backend-1img.onrender.com/api',
  timeout: 60000,
});

export default api;