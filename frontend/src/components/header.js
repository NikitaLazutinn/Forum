import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';

export default function Header({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/login');
  };

  return (
    <header className="app-header">
      <nav className="app-nav">
        <Link to="/posts/all" className="nav-link">All Posts</Link>
        <Link to="/posts/create" className="nav-link">Create Post</Link>
        <Link to="/posts/filter-sort" className="nav-link">Filter/Sort</Link>
      </nav>

      <div className="user-area">
        {user ? (
          <>
            <Link to={`/users/${user.id}`}>  
              <img
                src="../avatar.jpeg"
                alt={user.name}
                className="user-avatar"
              />
            </Link>
            <button
              onClick={handleLogout}
              className="nav-link logout-button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '12px' }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/auth/login')}
            className="nav-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
