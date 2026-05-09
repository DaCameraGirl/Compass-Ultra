const API_BASES = [
  import.meta.env.VITE_API_URL,
  'https://api.compassultra.com',
  'https://compass-ultra-backend.onrender.com',
]
  .filter(Boolean)
  .filter((base, index, all) => all.indexOf(base) === index);

async function request(path, token, options = {}) {
  let lastError;

  for (const base of API_BASES) {
    try {
      const res = await fetch(`${base}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const err = new Error(body.error || `API error ${res.status}`);
        err.status = res.status;
        if (res.status === 404 && !token) {
          lastError = err;
          continue;
        }
        throw err;
      }
      return res.json();
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('API URL is not configured');
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
  analyzeDemoFlags: (payload) =>
    request('/api/v1/analyze/demo', null, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getPlan: (token) => request('/api/v1/stripe/plan', token),
  createCheckout: (token, plan) =>
    request('/api/v1/stripe/checkout', token, {
      method: 'POST',
      body: JSON.stringify({ plan }),
    }),
  openPortal: (token) =>
    request('/api/v1/stripe/portal', token, { method: 'POST' }),
};
