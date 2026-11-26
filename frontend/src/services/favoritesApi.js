const API_BASE = import.meta.env.VITE_API_URL || '/api';

function handleResponse(res) {
  if (!res.ok) {
    return res.json().then((data) => {
      throw new Error(data.message || `Erro ${res.status}`);
    });
  }
  return res.json();
}

export function getFavorites(token) {
  return fetch(`${API_BASE}/favorites`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(handleResponse)
    .catch((err) => {
      throw new Error(err.message);
    });
}

export function addFavorite(placeId, token) {
  return fetch(`${API_BASE}/favorites/${placeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(handleResponse)
    .catch((err) => {
      throw new Error(err.message);
    });
}

export function removeFavorite(placeId, token) {
  return fetch(`${API_BASE}/favorites/${placeId}`, {
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
