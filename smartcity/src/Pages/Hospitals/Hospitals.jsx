import React, { useEffect, useState } from 'react';
import { getPlacesByCategory } from '../../services/placesService';
import './Hospitals.css';

export default function Hospitals() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await getPlacesByCategory('hospitals');
      if (mounted) {
        setItems(data);
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <main className="hospitals-page">
      <header className="hospitals-header">
        <h1>Hospitals</h1>
        <div className="hospitals-sub">Complete list of hospitals and clinics</div>
      </header>

      <section className="hospitals-content">
        {loading && <div className="loading">Loading hospitals…</div>}
        {!loading && items.length === 0 && <div>No hospitals found.</div>}

        {!loading && (
          <div className="items-grid">
            {items.map((s) => (
              <article key={s.id} className="item-card">
                {s.image && <img src={'data:image/jpeg;base64,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'} alt={s.name} className="item-thumb" />}
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
