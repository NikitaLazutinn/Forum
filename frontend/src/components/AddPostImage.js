import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addPostImage } from '../services/api';

export default function AddPostImage() {
  const { postId } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = e => setFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!file) {
      setError('Please select an image file');
      return;
    }
    try {
      await addPostImage(postId, file);
      navigate('/posts/all')
    } catch (err) {
      const msg = err.response.data.message;
      console.log(err.response.data);
      setError(msg);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Add Image to Post #{postId}</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        {error && <p role="alert" className="error">{error}</p>}
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}