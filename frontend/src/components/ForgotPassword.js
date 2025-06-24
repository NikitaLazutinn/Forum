import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      await forgotPassword(email);
      alert('Password reset link sent to your email.');
    } catch (err) {
      const message = err.response.data.message;
      setError(message);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        {error && (
          <p role="alert" aria-live="polite" class="error">{error}</p>
          )}
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}