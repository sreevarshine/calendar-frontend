// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://calendar-backend-six-phi.vercel.app', // your backend server
});

// Automatically attach JWT token from localStorage to every request
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
