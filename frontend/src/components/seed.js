import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserById, seed } from '../services/api';
import Post from './sub_components/Post';

export default function Seed() {

  const [error, setError] = useState('');

  useEffect(() => {
    seed()
      .catch(err => {
        const msg = err.response?.data?.message || 'Failed to load user';
        setError(msg);
      })
  });

  return (
    <div>
      ok    
    </div>
  );
}