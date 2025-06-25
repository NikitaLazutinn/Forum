import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function GoogleCallback() {
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(search).get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [search, navigate]);

  return <p>Logging you in…</p>;
}