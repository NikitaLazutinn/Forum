import React, { useState, useEffect } from 'react';
import { fetchCategories, createPost } from '../services/api';

export default function CreatePost() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', categoriesId: [] });
  const [error, setError] = useState('');


  useEffect(() => {
    fetchCategories()
      .then(res => setCategories(res.data.categories))
      .catch(() => setError('Cannot load categories'));
      
  }, []);

  const handleChange = e => {
    const { name, value, options } = e.target;
    if (name === 'categoriesId') {
      const vals = Array.from(options).filter(o => o.selected).map(o => Number(o.value));
      setForm({ ...form, categoriesId: vals });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await createPost(form);
    } catch (err) {
        const message = err.response.data.message;
        setError(message);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Create Post</h2>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea     
        style={{
            display: 'block',   
            width: '100%'
        }}
          name="content"
          rows="6"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          required
        />
        <select
        style={{
            display: 'block',            
            width: '100%',               
            margin: '20px 0',            
            padding: '8px 12px',         
            border: '1px solid #ccc',    
            borderRadius: '4px',         
            backgroundColor: '#f9f9f9', 
            fontSize: '1rem',            
            color: '#333',               
            boxSizing: 'border-box' 
          }}
          name="categoriesId"
          multiple
          value={form.categoriesId}
          onChange={handleChange}
          required
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {error && <p role="alert" className="error">{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}