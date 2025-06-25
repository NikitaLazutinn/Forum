import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import CreatePost from './components/CreatePost';
import PostsList from './components/PostsList';
import AddPostImage from './components/AddPostImage';
import FilterSortPosts from './components/FilterSortPosts';
import GoogleCallback from './components/GoogleCallback';


function App() {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/posts/create" element={<CreatePost />} />
      <Route path="/posts/all" element={<PostsList/>} />
      <Route path="/posts/:postId/add-image" element={<AddPostImage/>} />
      <Route path="posts/filter-sort" element={<FilterSortPosts/>} />
      <Route path="auth/googleCallback?token=${accessToken}" element={<GoogleCallback/>} />
      <Route
        path="/"
        element={<Navigate to="/posts/all" />}
      />
    </Routes>
  );
}

export default App;