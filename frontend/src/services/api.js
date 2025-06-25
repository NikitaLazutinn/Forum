import axios from 'axios';
import { formatISO} from 'date-fns';

const API_URL = 'http://localhost:3000';

export const registerUser = data => axios.post(`${API_URL}/auth/signUp`, data);
export const loginUser = data => axios.post(`${API_URL}/auth/logIn`, data);
export const googleLogin = () => { window.location.href = `${API_URL}/auth/google`; };
export const forgotPassword = email => axios.post(`${API_URL}/auth/forgot-password`, { email });
export const resetPassword = (token, data) =>
  axios.post(`${API_URL}/auth/reset-password?token=${token}`, data);
export const fetchTodos = token =>
  axios.get(`${API_URL}/todos`, { headers: { Authorization: `Bearer ${token}` } });
export const validateResetToken = token =>
  axios.get(`${API_URL}/auth/reset-password-checkToken?token=${token}`);
export const createPost = data => {
  const token = localStorage.getItem('token');          // ← grab it here
  return axios.post(
    `${API_URL}/posts/create`, 
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};
export const fetchCategories = () =>
  axios.get(`${API_URL}/categories/all`);

export const fetchPosts = () => {
  const token = localStorage.getItem('token');
  return axios.get(
    `${API_URL}/posts/all`, 
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};
export const addPostImage = (postId, file) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('postImage', file);
  return axios.post(
    `${API_URL}/img/${postId}/add-image`,
    formData,
    { headers: {
      Authorization: `Bearer ${token}`
    } }
  );
};
export const fetchFilteredPosts = params => {
  const token = localStorage.getItem('token');
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k,v]) => { if (v !== undefined && v !== '') { query.append(k, v instanceof Date ? formatISO(v) : v); }});
  return axios.get(`${API_URL}/posts/filter-sort?${query.toString()}`, { headers: {
    Authorization: `Bearer ${token}`
  } });
};