import React, { useEffect, useState, useMemo } from 'react';
import { getPlacesByCategory } from '../../services/placesService';
import './Schools.css';

export default function Schools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // fallback image for broken links
  const fallbackImg = "https://via.placeholder.com/600x400?text=School+Image";

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      const data = await getPlacesByCategory('schools');

      if (mounted) {
        setSchools(data);
        setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  return (
    <main className="schools-page">
      <header className="schools-header">
        <h1>Schools</h1>
        <p className="schools-sub">Complete list of schools with contact & location</p>
      </header>

      <section className="schools-content">
        {loading && <div className="loading">Loading schools…</div>}

        <div className="list-controls">
          <input
            className="search-input"
            placeholder="Search schools by name, address or notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {/* capacity filter options derived from data */}
          <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All capacities</option>
            <option value="small">Small (&lt;200)</option>
            <option value="medium">Medium (200-500)</option>
            <option value="large">Large (&gt;500)</option>
          </select>
        </div>
        {!loading && schools.length === 0 && (
          <div className="empty">No schools found.</div>
        )}

        {!loading && (
          <div className="schools-grid">
            {schools
              .filter((s) => {
                const q = query.trim().toLowerCase();
                if (q) {
                  const hay = `${s.name || ''} ${s.address || ''} ${s.description || s.notes || ''}`.toLowerCase();
                  if (!hay.includes(q)) return false;
                }
                if (filter !== 'all') {
                  const cap = Number(s.capacity) || (s.raw && Number(s.raw.capacity)) || 0;
                  if (filter === 'small' && !(cap > 0 && cap < 200)) return false;
                  if (filter === 'medium' && !(cap >= 200 && cap <= 500)) return false;
                  if (filter === 'large' && !(cap > 500)) return false;
                }
                return true;
              })
              .map((s) => (
                <article key={s.id} className="school-card">
                  {(s.image || s.imageLink) && (
                    <img
                      src={ s.imageLink || 'https://www.shutterstock.com/shutterstock/photos/2635812225/display_1500/stock-photo-modern-thai-school-building-made-of-red-bricks-with-large-glass-windows-plain-green-grass-field-in-2635812225.jpg'}
                      alt={s.name}
                      className="school-img"
                      onError={(e) => (e.target.src = fallbackImg)}
                    />
                  )}

                  <div className="school-card-body">
                    <h3 className="school-name">{s.name}</h3>
                    <p className="school-address">{s.address}</p>

                    <div className="school-meta">
                      <p><strong>Contact:</strong> {s.contact}</p>
                      <p><strong>Capacity:</strong> {s.capacity}</p>
                    </div>

                    <p className="school-desc">{s.notes || s.description}</p>

                    <button className="btn-detail" onClick={() => setSelected(s)}>
                      View Details
                    </button>
                  </div>
                </article>
              ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>{selected.name}</h2>
              <button className="btn-close" onClick={() => setSelected(null)}>×</button>
            </header>

            <div className="modal-body">
              <img
                src={"https://www.shutterstock.com/shutterstock/photos/2635812225/display_1500/stock-photo-modern-thai-school-building-made-of-red-bricks-with-large-glass-windows-plain-green-grass-field-in-2635812225.jpg"}
                alt={selected.name}
                className="modal-img"
                onError={(e) => (e.target.src = fallbackImg)}
              />

              <div className="modal-info">
                <p><strong>Address:</strong> {selected.address}</p>
                <p><strong>Contact:</strong> {selected.contact}</p>
                <p><strong>Capacity:</strong> {selected.capacity}</p>

                <p className="modal-desc">{selected.notes}</p>

                <div className="map-wrap">
                  <iframe
                    title="map"
                    className="map"
                    src={`https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${12.971}%2C${77.594}`}
                  />
                  <a
                    className="map-link"
                    href={selected.locationLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
