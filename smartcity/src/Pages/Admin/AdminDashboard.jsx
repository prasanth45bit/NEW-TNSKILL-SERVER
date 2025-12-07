import React, { useEffect, useState } from 'react';
import { isAdmin, getAuthHeader, logout } from '../../services/authService';
import '../Complaints/complaints.css';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin()) {
      window.location.hash = '#/admin/login';
      return;
    }
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/sql/complaints', { headers: { ...getAuthHeader() } });
        if (!res.ok) throw new Error('Failed to load complaints');
        const data = await res.json();
        if (mounted) setComplaints(data);
      } catch (err) {
        setError(err.message || 'Load failed');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  async function markResolved(id) {
    try {
      const res = await fetch(`/api/sql/complaints/${id}/resolve`, { method: 'POST', headers: { ...getAuthHeader() } });
      if (!res.ok) throw new Error('Failed');
      setComplaints((c) => c.map((it) => (it.id === id ? { ...it, status: 'resolved' } : it)));
    } catch (err) {
      setError(err.message || 'Action failed');
    }
  }

  return (
    <main className="admin-page p-6">
      <h2>Admin Dashboard</h2>
      <div style={{marginBottom:12}}>
        <button onClick={() => { logout(); window.location.hash = '#/'; }}>Logout</button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && complaints.length === 0 && <div>No complaints.</div>}
      <ul className="complaints-list">
        {complaints.map((c) => (
          <li key={c.id} className={`complaint ${c.status}`}>
            <h3><a href={`#/admin/complaints/${c.id}`}>{c.title}</a></h3>
            <div><strong>Category:</strong> {c.category}</div>
            <div>{c.description}</div>
            <div><strong>Status:</strong> {c.status}</div>
            {c.status !== 'resolved' && <button onClick={() => markResolved(c.id)}>Mark Resolved</button>}
          </li>
        ))}
      </ul>
    </main>
  );
}
