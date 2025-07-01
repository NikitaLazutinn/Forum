import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import CreatePost from './components/CreatePost';
import PostsList from './components/PostsList';
import AddPostImage from './components/AddPostImage';
import FilterSortPosts from './components/FilterSortPosts';
import GoogleCallback from './components/GoogleCallback';
import UserProfile from './components/UserProfile';

import { myProfile } from './services/api';
import CommentsPage from './components/CommentsPage';

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      myProfile()
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          navigate('/auth/login');
        });
    }
  }, [token, navigate]);

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/googleCallback" element={<GoogleCallback />} />
      </Route>

      <Route element={<ProtectedLayout user={user?.user} />}>
        <Route path="/posts/create" element={<CreatePost />} />
        <Route path="/posts/all" element={<PostsList />} />
        <Route path="/posts/:postId/add-image" element={<AddPostImage />} />
        <Route path="/posts/filter-sort" element={<FilterSortPosts />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="/posts/:postId/comments" element={<CommentsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/posts/all" />} />
    </Routes>
  );
}
