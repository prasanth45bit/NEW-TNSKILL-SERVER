import React, { useState } from 'react';
import { loginPublic } from '../../services/authService';
import './auth.css';

export default function PublicLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginPublic(form);
      window.location.hash = '#/raise';
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page p-6">
      <h2>Login (Public)</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <label>Email</label>
        <input value={form.email} type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <label>Password</label>
        <input value={form.password} type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <div style={{marginTop:12}}>
          <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </div>
        {error && <div className="auth-error">{error}</div>}
      </form>
    </main>
  );
}
