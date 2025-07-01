// src/components/CommentsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchComments, addComment, editComment, deleteComment } from '../services/api';

export default function CommentsPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [comments, setComments] = useState([]);
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = () => {
    fetchComments(postId)
      .then(res => {
        setComments(res.data.comments)
      })
  };

  const handleAdd = e => {
    e.preventDefault();
    if (!newText.trim()) return;
    addComment(postId, { content: newText })
      .then(() => {
        setNewText('');
        loadComments();
      })
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleEdit = id => {
    if (!editingText.trim()) return;
    editComment(id, { content: editingText })
      .then(() => {
        setEditingId(null);
        setEditingText('');
        loadComments();
      })
  };

  const handleDelete = id => {
    deleteComment(id)
      .then(() => {
        loadComments();
      })
  };

  return (
    <div className="container">
      {token ? (
        <form onSubmit={handleAdd} style={{ marginBottom: '16px' }}>
          <textarea
            rows={3}
            placeholder="Write a comment..."
            value={newText}
            onChange={e => setNewText(e.target.value)}
            required
          />
          <button type="submit">Add Comment</button>
        </form>
      ) : (
        <p>
          <button onClick={() => navigate('/auth/login')} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>
            Log in
          </button>{' '}
          to comment.
        </p>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {comments.map(c => (
          <li key={c.id} style={{ marginBottom: '12px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
            {editingId === c.id ? (
              <>
                <textarea
                  rows={2}
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                />
                <button onClick={() => handleEdit(c.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p style={{ margin: '0 0 8px' }}>{c.content}</p>
                <small style={{ color: '#555' }}>By {c.userName} on {c.createdAt.split('T')[0]}</small>
                {token && c.userId === JSON.parse(atob(token.split('.')[1])).id && (
                  <div style={{ marginTop: '8px' }}>
                    <button onClick={() => startEdit(c.id, c.content)} style={{ marginRight: '8px' }}>Edit</button>
                    <button onClick={() => handleDelete(c.id)}>Delete</button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
