const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3000';

function timeout(ms) {
  return new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));
}

async function fetchJson(url, opts = {}, ms = 5000) {
  const res = await Promise.race([fetch(url, opts), timeout(ms)]);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${text}`);
  }
  return res.json();
}

function saveSession(payload) {
  try {
    localStorage.setItem('smartcity_session', JSON.stringify(payload));
  } catch (e) {
    console.warn('saveSession failed', e);
  }
}

function clearSession() {
  localStorage.removeItem('smartcity_session');
}

function loadSession() {
  try {
    const s = localStorage.getItem('smartcity_session');
    return s ? JSON.parse(s) : null;
  } catch (e) {
    return null;
  }
}

export async function registerPublic(payload) {
  const url = `${API_BASE}/api/auth/register`;
  return fetchJson(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
}

export async function loginPublic(payload) {
  const url = `${API_BASE}/api/auth/login`;
  const data = await fetchJson(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (data.token) saveSession(data);
  return data;
}



export async function loginAdmin(payload) {
  const url = `${API_BASE}/api/auth/login`;
  const data = await fetchJson(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (data.token) saveSession(data);
  return data;
}

export function logout() {
  clearSession();
}

export function getSession() {
  return loadSession();
}

export function getAuthHeader() {
  const s = loadSession();
  if (!s || !s.token) return {};
  return { Authorization: `Bearer ${s.token}` };
}

export function isAdmin() {
  const s = loadSession();
  if (!s) return false;
  // Allow either an explicit role property or an admin flag from the server
  if (s.user && (s.user.role === 'admin' || s.user.isAdmin)) return true;
  if (s.role === 'admin') return true;
  return false;
}

export default {
  registerPublic,
  loginPublic,
  loginAdmin,
  logout,
  getSession,
  getAuthHeader,
  isAdmin,
};
