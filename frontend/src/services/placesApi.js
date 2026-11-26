import handleResponse from './handleResponse';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function getPlaces() {
  return fetch(`${API_BASE}/places`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(handleResponse)
    .catch((err) => {
      throw new Error(err.message);
    });
}

export function createPlace(place, token) {
  return fetch(`${API_BASE}/places`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(place),
  })
    .then(handleResponse)
    .catch((err) => {
      throw new Error(err.message);
    });
}

export function deletePlace(placeId, token) {
  return fetch(`${API_BASE}/places/${placeId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(handleResponse)
    .catch((err) => {
      throw new Error(err.message);
    });
}
