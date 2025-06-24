import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../services/api';

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
    <div className="container">
      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map(post => (
            <li key={post.id} style={{ marginBottom: '16px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <h3 style={{ margin: 0 }}>{post.title}</h3>
              <p style={{ margin: '8px 0' }}>{post.content}</p>
              {post.categories && post.categories.length > 0 && (
                <p style={{ fontSize: '0.9rem', color: '#555' }}>
                  Categories: {post.categories.map(c => c.category.name).join(', ')}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}