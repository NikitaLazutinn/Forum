import React from 'react';
import { Link } from 'react-router-dom';
import './header.css'; 

export default function Header({ user }) {
  return (
    <header className="app-header">
      <nav className="app-nav">
        <Link to="/" className="nav-link">All Posts</Link>
        <Link to="/create-post" className="nav-link">Create Post</Link>
        <Link to="/filter-sort" className="nav-link">Filter/Sort</Link>
      </nav>

      <div className="user-area">
        {user ? (
          <Link to={`/users/${user.id}`}>
            <img
              src='.\avatar.jpeg'
              alt={user.name}
              className="user-avatar"
            />
          </Link>
        ) : (
          <button
            onClick={() => window.location.reload()}
            className="nav-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Profile
        </button>
        )}
      </div>
    </header>
  );
}
