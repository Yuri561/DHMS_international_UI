
// this file will contain all the files related to the AuthFolder
import axios from 'axios'
// we import axios to make HTTP requests

// This file contains all the auth-related API functions
const API_URL = import.meta.env.VITE_API_URL;

// User login authentication
export const userLogin = async (FormData: any) => {
  return axios.post(`${API_URL}/login`, FormData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true
  });
 
};

// User registration authentication
export const userRegister = async (FormData: any) => {
  return axios.post(`${API_URL}/register`, FormData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true
  });
};

// fetch all products 
export const fetchProducts = async ()=> {
  return axios.get(`${API_URL}/products`, {
    headers: {'Content-Type': "application/json"
    },
  withCredentials:true,
  
})
}

// reset password 

export const resetPassword = async (email:string) => {
  return axios.post(`${API_URL}/reset-password`, 
    {email},
    {headers: {'Content-Type': "application/json"}}
  )
}