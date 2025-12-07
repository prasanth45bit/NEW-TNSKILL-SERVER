import React, { useEffect, useState } from 'react';
import { MapPin } from "lucide-react";
import { getSession, isAdmin, logout } from '../../services/authService';
import './Navbar.css';

function Navbar() {
  const [hash, setHash] = useState(window.location.hash || '#/');
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(() => getSession());

  useEffect(() => {
    const onHash = () => {
      setHash(window.location.hash || '#/');
      setOpen(false);
    };

    const onStorage = (e) => {
      if (e.key === 'smartcity_session') {
        setSession(getSession());
      }
    };

    window.addEventListener('hashchange', onHash);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  function handleLogout() {
    logout();
    setSession(null);
    window.location.hash = '#/';
  }

  const baseLinks = [
    { to: '#/', label: 'Home' },
    { to: '#/schools', label: 'Schools' },
    { to: '#/hospitals', label: 'Hospitals' },
    { to: '#/transport', label: 'Transport' },
    { to: '#/attractions', label: 'Attractions' },
  ];

  // Dynamic Links
  const links = [...baseLinks];

  if (session && !isAdmin()) {
    // Normal user
    links.push({ to: '#/raise', label: 'Raise Complaint' });
  }

  if (session && isAdmin()) {
    // Admin dashboard
    links.push({ to: '#/complaints', label: 'View Complaints' });
  }

  return (
    <header className="smart-header">
      <div className="brand">
        <div className="logo-pill"><MapPin size={18} /></div>
        <div className="logo">SmartCity</div>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className={`hamburger ${open ? 'open' : ''}`} 
        aria-label="Toggle menu" 
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Nav Links */}
      <nav className={`nav ${open ? 'open' : ''}`}>
        <ul>
          {links.map((l) => (
            <li key={l.to}>
              <a href={l.to} className={hash === l.to ? 'active' : ''}>
                {l.label}
              </a>
            </li>
          ))}

          {/* Auth Buttons */}
          {!session && (
            <>
              <li><a href="#/login" className={hash === '#/login' ? 'active' : ''}>Login</a></li>
              <li><a href="#/register" className={hash === '#/register' ? 'active' : ''}>Register</a></li>
            </>
          )}

          {session && (
            <li className="nav-user">
              <span className="user-name">{session.user?.name || session.user?.email}</span>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
