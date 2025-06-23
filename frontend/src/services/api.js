import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const registerUser = data => axios.post(`${API_URL}/auth/signUp`, data);
export const loginUser = data => axios.post(`${API_URL}/auth/logIn`, data);
export const googleLogin = () => { window.location.href = `${API_URL}/auth/google`; };
export const forgotPassword = email => axios.post(`${API_URL}/auth/forgot-password`, { email });
export const resetPassword = (token, data) =>
  axios.post(`${API_URL}/auth/reset-password?token=${token}`, data);
export const fetchTodos = token =>
  axios.get(`${API_URL}/todos`, { headers: { Authorization: `Bearer ${token}` } });