import React, { useEffect, useState } from 'react';
import { isAdmin, getAuthHeader } from '../../services/authService';
import '../Complaints/complaints.css';

export default function ComplaintDetail({ id }) {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      window.location.hash = '#/admin/login';
      return;
    }
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/sql/complaints/${id}`, { headers: { ...getAuthHeader() } });
        if (!res.ok) throw new Error('Failed to load complaint');
        const data = await res.json();
        if (mounted) setComplaint(data);
      } catch (err) {
        setError(err.message || 'Load failed');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [id]);

  async function resolveIt() {
    if (!complaint) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/sql/complaints/${id}/resolve`, { method: 'POST', headers: { ...getAuthHeader() } });
      if (!res.ok) throw new Error('Failed to resolve');
      setComplaint((c) => ({ ...c, status: 'resolved' }));
    } catch (err) {
      setError(err.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <main className="admin-page p-6">Loading...</main>;
  if (error) return <main className="admin-page p-6"><div className="error">{error}</div></main>;
  if (!complaint) return <main className="admin-page p-6">Complaint not found.</main>;

  return (
    <main className="admin-page p-6">
      <h2>Complaint: {complaint.title}</h2>
      <div style={{marginBottom:12}}>
        <strong>Category:</strong> {complaint.category} &nbsp; <strong>Priority:</strong> {complaint.priority}
      </div>
      <div style={{marginBottom:8}}><strong>Reporter:</strong> {complaint.reporterName || complaint.reporterId}</div>
      <div style={{marginBottom:8}}><strong>Status:</strong> {complaint.status}</div>
      <div style={{marginBottom:12}}>{complaint.description}</div>

      {complaint.notes && (
        <div style={{whiteSpace:'pre-wrap', background:'#f7f7fb', padding:12, borderRadius:8, marginBottom:12}}>
          <strong>Notes / App details</strong>
          <pre style={{marginTop:8}}>{complaint.notes}</pre>
        </div>
      )}

      {complaint.status !== 'resolved' && (
        <div>
          <button onClick={resolveIt} disabled={actionLoading} className="btn-logout">{actionLoading ? 'Resolving...' : 'Mark Resolved'}</button>
          <button style={{marginLeft:8}} onClick={() => window.location.hash = '#/admin'}>Back to list</button>
        </div>
      )}

      {complaint.status === 'resolved' && (
        <div>
          <span>Already resolved.</span>
          <button style={{marginLeft:8}} onClick={() => window.location.hash = '#/admin'}>Back to list</button>
        </div>
      )}
    </main>
  );
}
