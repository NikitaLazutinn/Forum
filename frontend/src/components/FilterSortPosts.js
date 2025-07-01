import React, { useState } from 'react';
import { fetchFilteredPosts } from '../services/api';
import Post from './sub_components/Post';


export default function FilterSortPosts() {
  const [filters, setFilters] = useState({
    createdFrom: '', createdTo: '', updatedFrom: '', updatedTo: '', published: false,
    title: '', content: '', categoryName: '', sortField: 'createdAt', sortOrder: 'asc', skip: 0, take: 10, searchQuery: ''
  });
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, type, value, checked } = e.target;
    setFilters({ ...filters, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault(); setError('');
    try {
      const params = { ...filters };
      setPosts((await fetchFilteredPosts(params)).data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Filter failed';
      setError(msg);
    }
  };

  return (
    <div className="container">
      <h2>Filter & Sort Posts</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {['createdFrom','createdTo','updatedFrom','updatedTo'].map(field => (
          <div key={field}>
            <label>{field}</label>
            <input type="date" name={field} value={filters[field]} onChange={handleChange} />
          </div>
        ))}
        <div><label>Published</label><input type="checkbox" name="published" checked={filters.published} onChange={handleChange} /></div>
        <div><label>Title</label><input name="title" value={filters.title} onChange={handleChange} /></div>
        <div><label>Content</label><input name="content" value={filters.content} onChange={handleChange} /></div>
        <div><label>Category</label><input name="categoryName" value={filters.categoryName} onChange={handleChange} /></div>
        <div><label>Sort Field</label>
          <select name="sortField" value={filters.sortField} onChange={handleChange}>
            {['createdAt','updatedAt','title'].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div><label>Sort Order</label>
          <select name="sortOrder" value={filters.sortOrder} onChange={handleChange}>
            <option value="asc">asc</option><option value="desc">desc</option>
          </select>
        </div>
        <div><label>Skip</label><input type="number" name="skip" value={filters.skip} onChange={handleChange} /></div>
        <div><label>Take</label><input type="number" name="take" value={filters.take} onChange={handleChange} /></div>
        <div style={{ gridColumn: '1 / -1' }}><button type="submit">Apply Filters</button></div>
      </form>
      {error && <p role="alert" className="error">{error}</p>}
      {
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map(post => (
          <Post key={post.id} post={post} />
          ))}
        </ul>
      }
    </div>
  );
}
