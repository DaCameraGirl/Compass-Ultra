const normalizeBase = (base) => base?.replace(/\/+$/, '');

const isValidUrl = (base) => {
  try { return base && new URL(base).protocol.startsWith('http'); }
  catch { return false; }
};

const API_BASES = [
  normalizeBase(import.meta.env.VITE_API_URL),
  'https://compass-ultra-backend-production.up.railway.app',
]
  .filter(isValidUrl)
  .filter((base, index, all) => all.indexOf(base) === index);

async function request(path, token, options = {}) {
  const { timeoutMs = 8000, ...fetchOptions } = options;
  let lastError;

  for (const base of API_BASES) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(`${base}${path.startsWith('/') ? path : `/${path}`}`, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(fetchOptions.headers || {}),
        },
      });
      clearTimeout(timer);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const err = new Error(body.error || `API error ${res.status}`);
        err.status = res.status;
        err.hint = body.hint;
        if (res.status === 404 && !token) {
          lastError = err;
          continue;
        }
        throw err;
      }
      return res.json();
    } catch (err) {
      clearTimeout(timer);
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
      timeoutMs: 45000,
    }),
  analyzeDemoFlags: (payload) =>
    request('/api/v1/analyze/demo', null, {
      method: 'POST',
      body: JSON.stringify(payload),
      timeoutMs: 30000,
    }),
  syncUser: (token, profile = {}) =>
    request('/api/v1/users/me', token, {
      method: 'POST',
      body: JSON.stringify({ source: 'app', ...profile }),
    }),
  getCurrentUser: (token) => request('/api/v1/users/me', token),
  listSignups: (token) => request('/api/v1/users/signups', token),
  listSignupEvents: (token) => request('/api/v1/users/signup-events', token),
  getPlan: (token) => request('/api/v1/stripe/plan', token),
  createCheckout: (token, plan) =>
    request('/api/v1/stripe/checkout', token, {
      method: 'POST',
      body: JSON.stringify({ plan }),
    }),
  openPortal: (token) =>
    request('/api/v1/stripe/portal', token, { method: 'POST' }),
};
