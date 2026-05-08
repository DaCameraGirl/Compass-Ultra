const BASE = import.meta.env.VITE_API_URL;

async function request(path, token, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  listSnapshots: (token) => request('/api/v1/snapshots', token),
  getSnapshot: (id) => request(`/api/v1/snapshots/${id}`, null),
  saveSnapshot: (token, name, description, snapshot_data, is_public = false) =>
    request('/api/v1/snapshots', token, {
      method: 'POST',
      body: JSON.stringify({ name, description, snapshot_data, is_public }),
    }),
  deleteSnapshot: (token, id) =>
    request(`/api/v1/snapshots/${id}`, token, { method: 'DELETE' }),
  shareSnapshot: (token, id) =>
    request(`/api/v1/snapshots/${id}/share`, token, { method: 'POST' }),
  analyzeFlags: (token, payload) =>
    request('/api/v1/analyze', token, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getPlan: (token) => request('/api/v1/stripe/plan', token),
  createCheckout: (token, plan) =>
    request('/api/v1/stripe/checkout', token, {
      method: 'POST',
      body: JSON.stringify({ plan }),
    }),
};
