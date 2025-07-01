import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogin, registerUser } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      await registerUser(form);
      navigate('/auth/login');
    } catch (err) {
      const message = err.response.data.message;
      setError(message);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
        {error && (
          <p role="alert" aria-live="polite" class="error">{error}</p>
          )}
        <button type="submit">Register</button>
      </form>
      <button onClick={googleLogin}>Continue with Google</button>
    </div>
  );
}