// src/components/PostItem.js
import React, { useEffect, useState } from 'react';
import { Like, showLikes } from '../../services/api';

export default function Post({ post }) {
  const [likes, setLikes] = useState(0);
  const [myLike, setMyLike] = useState(false);

  const activeStyle = {
    background: '#FF1010',
    color: '#fff',
  };
  const inactiveStyle = {
    background: '#ccc',
    color: '#666',
  };

  useEffect(() => {
      showLikes(post.id)
        .then(res => {
          setLikes(res.data.likes.length)
          console.log(res.data);
          setMyLike(res.data.I_Liked)
        })
    }, [post.id]);

    const handleLike = () => {
      Like(post.id)            
        .then(() => showLikes(post.id))  
        .then(res => {setLikes(res.data.likes.length)
          setMyLike(res.data.I_Liked)
        })
        .catch(err => console.error(err));
    };
      
    

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
      <div className= 'right'>
        <button onClick={handleLike} style={{width : '10%', background: '#aeaeae',
          ...(myLike ? activeStyle : inactiveStyle)
        }}>Like {likes}</button>
      </div>

      </div>
      
    </li>
  );
};
