import places from '../data/places.json';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3000';

const CATEGORY_ENDPOINTS = {
  schools: 'schools',
  hospitals: 'hospitals',
  transport: 'transport',
  attractions: 'tourism',
  energies: 'energy',
};

function timeout(ms) {
  return new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));
}

async function fetchJson(url, opts = {}, ms = 4000) {
  try {
    const res = await Promise.race([fetch(url, opts), timeout(ms)]);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('fetchJson error', err, url);
    throw err;
  }
}

function normalizeRow(category, row, idx) {
  // Generic normalizer: maps known fields into the UI shape used by components.
  const name = row.name || row.title || row.provider || `Item ${idx + 1}`;
  const address = row.address || row.location || row.route || '';
  const contact = row.contact || row.operator || row.phone || '';
  const capacity = row.capacity || row.beds || row.capacity_kw || null;
  const notes = row.notes || row.description || '';

  // Attempt to find coordinates fields if present
  const lat = row.lat || row.latitude || row.lat_decimal || null;
  const lng = row.lng || row.longitude || row.lon || row.lng_decimal || null;

  // Provide a category-specific placeholder image when none provided
  const placeholder = `https://source.unsplash.com/collection/8792488/800x600?${category}`;

  return {
    id: row.id || row._id || `${category}-${idx}`,
    name,
    address,
    contact,
    capacity,
    description: notes,
    lat: lat !== undefined ? lat : null,
    lng: lng !== undefined ? lng : null,
    image: row.image || row.photo || placeholder,
    category,
    raw: row,
  };
}

export async function getPlacesByCategory(category) {
  const endpoint = CATEGORY_ENDPOINTS[category] || category;

  // Try API first
  try {
    const url = `${API_BASE}/api/sql/${endpoint}`;
    const data = await fetchJson(url);
    if (Array.isArray(data)) {
      return data.map((r, i) => normalizeRow(category, r, i));
    }
    // If API responds with an object wrapper (e.g., { rows: [...] })
    if (data && Array.isArray(data.rows)) {
      return data.rows.map((r, i) => normalizeRow(category, r, i));
    }
    throw new Error('Unexpected API response');
  } catch (err) {
    // Fallback to static data
    await new Promise((res) => setTimeout(res, 120));
    return places.filter((p) => p.category === category).map((p, i) => ({ ...p, raw: p }));
  }
}

export async function getAllPlaces() {
  // Try to fetch each known category and merge results; fall back to static file when needed.
  const categories = Object.keys(CATEGORY_ENDPOINTS);
  const results = [];
  await Promise.all(
    categories.map(async (c) => {
      try {
        const items = await getPlacesByCategory(c);
        results.push(...items);
      } catch (e) {
        // ignore individual category errors
      }
    })
  );
  // If we got nothing from API (e.g., server down), fall back to static file
  if (results.length === 0) return places.map((p) => ({ ...p, raw: p }));
  return results;
}

export async function searchPlaces(q) {
  const term = (q || '').trim().toLowerCase();
  if (!term) return getAllPlaces();

  // Search across all places loaded from API/static
  const all = await getAllPlaces();
  return all.filter(
    (p) => (p.name || '').toLowerCase().includes(term) || (p.description || '').toLowerCase().includes(term) || (p.address || '').toLowerCase().includes(term)
  );
}
