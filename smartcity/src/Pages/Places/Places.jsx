import React, { useEffect, useState } from 'react';
import { getPlacesByCategory, searchPlaces } from '../../services/placesService';
import PlaceCard from '../../Components/PlaceCard/PlaceCard';
import './Places.css';

export default function Places({ category }) {
  const [places, setPlaces] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      if (query) {
        const res = await searchPlaces(query);
        if (mounted) {
          // if category filter is present, also filter by it
          setPlaces(res.filter((p) => (category ? p.category === category : true)));
          setLoading(false);
        }
      } else {
        const data = await getPlacesByCategory(category);
        if (mounted) {
          setPlaces(data);
          setLoading(false);
        }
      }
    })();
    return () => (mounted = false);
  }, [category, query]);

  return (
    <main className="places-page p-6 min-h-screen">
      <header className="places-header">
        <h1 className="places-title">{category?.charAt(0).toUpperCase() + category?.slice(1)}</h1>
        <div className="places-search">
          <input
            placeholder="Search places..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="places-search-input"
          />
        </div>
      </header>

      <section className="places-list mt-4">
        {loading && <div>Loading...</div>}
        {!loading && places.length === 0 && <div>No results found.</div>}
        {!loading && places.map((p) => <PlaceCard key={p.id} place={p} onView={(pl) => setSelected(pl)} />)}
      </section>

      {selected && (
        <div className="places-modal-overlay" onClick={() => setSelected(null)}>
          <div className="places-modal" onClick={(e) => e.stopPropagation()}>
            <div className="places-modal-top">
              <h2>{selected.name}</h2>
              <button className="btn-close" onClick={() => setSelected(null)}>Close</button>
            </div>
            <div className="places-modal-body">
              <div className="places-image-col">
                {selected.image && <img src={selected.image} alt={selected.name} className="places-large-image" />}
              </div>
              <div className="places-info-col">
                <div><strong>Address:</strong> {selected.address}</div>
                <div><strong>Contact:</strong> {selected.contact}</div>
                {selected.lat != null && selected.lng != null && (
                  <div><strong>Coordinates:</strong> {selected.lat}, {selected.lng}</div>
                )}
                <div className="places-desc" style={{marginTop:8}}>{selected.description}</div>

                {selected.lat != null && selected.lng != null && (
                  <div className="map-embed-wrap" style={{marginTop:12}}>
                    <iframe
                      title="map"
                      className="map-embed"
                      src={
                        (() => {
                          const lat = selected.lat;
                          const lon = selected.lng;
                          const d = 0.01;
                          const bbox = `${lon - d}%2C${lat - d}%2C${lon + d}%2C${lat + d}`;
                          return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
                        })()
                      }
                    />
                    <div className="map-link"><a href={`https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}#map=16/${selected.lat}/${selected.lng}`} target="_blank" rel="noreferrer">Open in OpenStreetMap</a></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
