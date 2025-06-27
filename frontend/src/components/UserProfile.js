import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserById } from '../services/api';
import { toast } from 'react-toastify';

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserById(id)
      .then(res => setUser(res.data))
      .catch(err => {
        const msg = err.response?.data?.message || 'Failed to load user';
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (error) return <div className="container"><p role="alert">{error}</p></div>;

  return (
    <div className="container">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
}