import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../services/api';
import Post from './sub_components/Post';

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts()
      .then(res => {setPosts(res.data.posts)
  })
      .catch(err => {
        const message = err.response.data.message;
        setError(message);
      });
  }, []);

  if (error) return <div className="container"><p role="alert">{error}</p></div>;

  return (
    <div className="postsList">
      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
         {[...posts].reverse().map(post => (
          <Post key={post.id} post={post} />
         ))}
       </ul>
      )}
    </div>
  );
}