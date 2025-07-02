import axios from 'axios';

// Create a reusable instance
const api = axios.create({
  baseURL: 'https://dhms-backend.onrender.com',
  withCredentials: true, // Make sure  (cookies) are sent
});



// Handle 401 errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('username')
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
