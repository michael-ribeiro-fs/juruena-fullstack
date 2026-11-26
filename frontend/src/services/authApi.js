const API_BASE = import.meta.env.VITE_API_URL || '/api';

function handleResponse(res) {
  if (!res.ok) {
    return res.json().then((data) => {
      throw new Error(data.message || `Erro ${res.status}`);
    });
  }
  return res.json();
}

export function signUp({ name, email, password }) {
  return fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
    .then(handleResponse)
    .catch((err) => {
      throw new Error(err.message);
    });
}

export function signIn({ email, password }) {
  return fetch(`${API_BASE}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
    .then(handleResponse)
    .catch((err) => {
      throw new Error(err.message);
    });
}

export function getCurrentUser(token) {
  return fetch(`${API_BASE}/users/me`, {
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
