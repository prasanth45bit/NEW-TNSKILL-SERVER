import React, { useEffect, useState } from 'react';
import { getPlacesByCategory } from '../../services/placesService';
import './Attractions.css';

export default function Attractions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await getPlacesByCategory('attractions');
      if (mounted) {
        setItems(data);
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <main className="attractions-page">
      <header className="attractions-header">
        <h1>Tourist Attractions</h1>
        <div className="attractions-sub">Places to visit in the city</div>
      </header>

      <section className="attractions-content">
        {loading && <div className="loading">Loading attractions…</div>}
        {!loading && items.length === 0 && <div>No attractions found.</div>}

        {!loading && (
          <div className="items-grid">
            {items.map((s) => (
              <article key={s.id} className="item-card">
                {s.image && <img src={'https://hblimg.mmtcdn.com/content/hubble/img/agra/mmt/activities/m_activities-agra-taj-mahal_l_400_640.jpg'} alt={s.name} className="item-thumb" />}
                <div className="item-card-body">
                  <div className="item-row">
                    <div>
                      <h3 className="item-name">{s.name}</h3>
                      <div className="item-address">{s.address}</div>
                    </div>
                    <div className="item-actions">
                      <button className="btn-detail" onClick={() => setSelected(s)}>View</button>
                    </div>
                  </div>

                  <div className="item-meta">
                    <div><strong>Contact:</strong> {s.contact}</div>
                    <div><strong>Coordinates:</strong> {s.lat}, {s.lng}</div>
                  </div>

                  <div className="item-desc">{s.description}</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <h2>{selected.name}</h2>
              <div><button onClick={() => setSelected(null)} className="btn-close">Close</button></div>
            </div>
            <div className="modal-body">
              <div className="modal-col">
                {selected.image && <img src={selected.image} alt={selected.name} className="places-large-image" />}
              </div>
              <div className="modal-col">
                <div><strong>Address</strong> {selected.address}</div>
                <div><strong>Contact</strong> {selected.contact}</div>
                <div><strong>Coordinates</strong> {selected.lat}, {selected.lng}</div>
                <div className="places-desc" style={{marginTop:8}}>{selected.description}</div>
                <div className="map-embed-wrap" style={{marginTop:12}}>
                  <iframe
                    title="map"
                    className="map-embed"
                    src={(() => {
                      const lat = selected.lat;
                      const lon = selected.lng;
                      const d = 0.01;
                      const bbox = `${lon - d}%2C${lat - d}%2C${lon + d}%2C${lat + d}`;
                      return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
                    })()}
                  />
                  <div className="map-link"><a href={`https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}#map=16/${selected.lat}/${selected.lng}`} target="_blank" rel="noreferrer">Open in OpenStreetMap</a></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
