// src/components/PostItem.js
import React from 'react';

export default function Post({ post }) {
  console.log(post);
  const iso = post.createdAt;
  const date = iso.split('T')[0];

  return (
    <li
    style={{
      marginBottom: '16px',
      position: 'relative',
      padding: '12px',                 
      minHeight: '150px',                         
      background: '#fff',
      border: 'none',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      borderRadius: '6px',
      minHeight: '200px',
    }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between', 
          alignItems: 'center',           
        }}
      >
        <h3 style={{ margin: 0 }}>{post.title}</h3>
        <p style={{ margin: 0 }}>{post?.author?.name}</p>
      </div>

      <p style={{ margin: 0 }}>{post.content}</p>

      <div style={{
        position: 'absolute',
        bottom: '0',
        width: '100%',
      }}>
      {post.categories && post.categories.length > 0 && (
        <p>
          Categories: {post.categories.map(c => (
        <span key={c.id} className="badge">{c.category.name}</span>
      ))}
        </p>
      )}

      <p>
        {date}  
      </p>
      </div>
      
    </li>
  );
}
