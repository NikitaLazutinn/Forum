import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword, validateResetToken } from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Missing token');
    }
    validateResetToken(token)
      .then(() => setError(''))            
      .catch(err => setError(err.response.data.message))   
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      await resetPassword(token, { password: form.password, confirmPassword: form.confirmPassword });
      alert('Password reset successful!');
      navigate('/auth/login');
    } catch (err) {
      const message = err.response.data.message;
      setError(message);
    }
  };

  if (!token) return <p>Invalid or missing token.</p>;

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <input
          type="password"
          name="password"
          placeholder="New Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        {error && (
          <p role="alert" aria-live="polite" class="error">{error}</p>
          )}
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}