import axios from 'axios';
import { formatISO} from 'date-fns';

const API_URL = 'http://localhost:3000';

const http = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {

      localStorage.removeItem('token');

      window.location.href = 'http://localhost:3001/auth/login';
    }
    return Promise.reject(error);
  }
);

export const registerUser = data => http.post(`${API_URL}/auth/signUp`, data);
export const loginUser = data => http.post(`${API_URL}/auth/logIn`, data);
export const googleLogin = () => { window.location.href = `${API_URL}/auth/google`; };
export const forgotPassword = email => http.post(`${API_URL}/auth/forgot-password`, { email });
export const resetPassword = (token, data) =>
  http.post(`${API_URL}/auth/reset-password?token=${token}`, data);
export const fetchTodos = token =>
  http.get(`${API_URL}/todos`, { headers: { Authorization: `Bearer ${token}` } });
export const validateResetToken = token =>
  http.get(`${API_URL}/auth/reset-password-checkToken?token=${token}`);
export const createPost = data => {
  const token = localStorage.getItem('token');          // ← grab it here
  return http.post(
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
  http.get(`${API_URL}/categories/all`);

export const fetchPosts = () => {
  const token = localStorage.getItem('token');
  return http.get(
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
  return http.post(
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
  return http.get(`${API_URL}/posts/filter-sort?${query.toString()}`, { headers: {
    Authorization: `Bearer ${token}`
  } });
};
export const myProfile = () =>
{
  const token = localStorage.getItem('token');
  return http.get(`${API_URL}/user/me`, { headers: {
    Authorization: `Bearer ${token}`
  } });
}