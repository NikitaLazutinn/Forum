import React, { useEffect, useState } from 'react';
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
import Header from './components/header';
import { myProfile } from './services/api';


function App() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      myProfile()
        .then(res => {
          setUser(res.data)
          console.log(res.data);
        }
      )
        .catch(() => {
          window.location.href = 'auth/login';
        });
    }
  }, [token]);

  return (
    <>
    <Header user={user} /> 
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/posts/create" element={<CreatePost />} />
      <Route path="/posts/all" element={<PostsList/>} />
      <Route path="/posts/:postId/add-image" element={<AddPostImage/>} />
      <Route path="posts/filter-sort" element={<FilterSortPosts/>} />
      <Route path="auth/googleCallback" element={<GoogleCallback/>} />
      <Route
        path="/"
        element={<Navigate to="/posts/all" />}
      />
    </Routes>
    </>
  );
}

export default App;