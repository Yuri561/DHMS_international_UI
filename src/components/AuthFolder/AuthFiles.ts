
// this file will contain all the files related to the AuthFolder
// import axios from 'axios'
// we import axios to make HTTP requests

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// User login (needs credentials for session cookie)
export const userLogin = (formData: any) => {
  return axios.post(`${API_URL}/login`, formData, { withCredentials: true });
};

// User registration
export const userRegister = (formData: any) => {
  return axios.post(`${API_URL}/register`, formData);
};

// Fetch all products
export const fetchProducts = () => {
  return axios.get(`${API_URL}/products`);
};

// Reset password request (no session required; credentials optional)
export const resetPassword = (email: string) => {
  return axios.post(`${API_URL}/reset-password-request`, { email });
};


