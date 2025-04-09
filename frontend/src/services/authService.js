import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (data) => {
  return await axios.post(`${API_BASE_URL}/login`, data);
};

export const register = async (data) => {
  return await axios.post(`${API_BASE_URL}/register`, data);
};

export const forgotPassword = async (data) => {
  return await axios.post(`${API_BASE_URL}/forgot-password`, data);
};
export const resetPassword = async (token, data) => {
  return await axios.post(`${API_BASE_URL}/reset-password/${token}`, data);
};
export const getAllUsers = async (token) =>
  axios.post(
    `${API_BASE_URL}/admin/users`,
    {},
    {
      // Empty object for payload
      headers: { Authorization: `Bearer ${token}` },
    }
  );
