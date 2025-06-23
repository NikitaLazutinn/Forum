import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return alert('Passwords do not match');
    try {
      await resetPassword(token, { password: form.password, confirmPassword: form.confirmPassword });
      alert('Password reset successful!');
      navigate('/login');
    } catch {
      alert('Reset failed');
    }
  };

  if (!token) return <p>Invalid or missing token.</p>;

  return (
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
      <button type="submit">Reset Password</button>
    </form>
  );
}