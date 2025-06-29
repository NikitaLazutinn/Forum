import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserById } from '../services/api';
import Post from './sub_components/Post';

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserById(id)
      .then(res => {
        console.log(res.data.user);
        setUser(res.data.user)
      })
      .catch(err => {
        const msg = err.response?.data?.message || 'Failed to load user';
        setError(msg);
      })
  }, [id]);

  if (error || !user) return <div className="container"><p role="alert">{error}</p></div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Email: {user.email}</h3>
      <h2>Posts</h2>

      <div className="postsList">
        {user.posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {user.posts.map(post => (
            <Post key={post.id} post={post} />
            ))}
          </ul>
        )}
      </div>
      
    </div>
  );
}