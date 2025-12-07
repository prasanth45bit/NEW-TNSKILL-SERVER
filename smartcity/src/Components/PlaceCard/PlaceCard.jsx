import React from 'react';
import './PlaceCard.css';

export default function PlaceCard({ place, onView }) {
  return (
    <article className="place-card" onClick={() => onView && onView(place)}>
      {place.image && <img src={place.image} alt={place.name} className="place-thumb" />}
      <div className="place-card-body">
        <div className="place-card-header">
          <h3>{place.name}</h3>
          <div className="place-category">{place.category}</div>
        </div>
        <div className="place-desc">{place.description}</div>
        <div className="place-meta">
          <div className="place-address">{place.address}</div>
          <div className="place-contact">{place.contact}</div>
        </div>
      </div>
    </article>
  );
}
