import axios from "axios";
const API_BASE_URL = "http://localhost:5000/api";

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