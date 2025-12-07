import React, { useState } from 'react';
import { registerPublic, loginPublic } from '../../services/authService';
import './auth.css';

export default function PublicRegister() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerPublic(form);
      // Auto-login after register
      await loginPublic({ email: form.email, password: form.password });
      window.location.hash = '#/';
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page p-6">
      <h2>Register (Public)</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <label>Name</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <label>Email</label>
        <input value={form.email} type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <label>Password</label>
        <input value={form.password} type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <div style={{marginTop:12}}>
          <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </div>
        {error && <div className="auth-error">{error}</div>}
      </form>
    </main>
  );
}
