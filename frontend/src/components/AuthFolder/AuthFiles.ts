// ------------------------------------------------------------
// Auth-related API calls
// ------------------------------------------------------------
//
// All requests go through the shared axios instance so they
// inherit:
//   - baseURL from VITE_API_URL
//   - withCredentials: true (session + cartId cookies)

import api from "../setUpAxios";

// User login (needs credentials for session cookie)
export const userLogin = (formData: any) => {
    return api.post(`/login`, formData);
};

// User registration
export const userRegister = (formData: any) => {
    return api.post(`/register`, formData);
};

// Fetch all products
export const fetchProducts = () => {
    return api.get(`/products`);
};

// Reset password request — triggers an email with the reset
// link. The link itself is NOT returned in the response.
export const resetPassword = (email: string) => {
    return api.post(`/reset-password-request`, { email });
};

// Reset password apply — consumes the token from the email
// link and sets the new password.
export const applyPasswordReset = (
    token: string,
    newPassword: string
) => {
    return api.post(`/reset-password`, {
        token,
        newPassword,
    });
};
