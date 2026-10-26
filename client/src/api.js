async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  list: () => request('/api/tasks'),
  create: (title) =>
    request('/api/tasks', { method: 'POST', body: JSON.stringify({ title }) }),
  update: (id, changes) =>
    request(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(changes) }),
  remove: (id) => request(`/api/tasks/${id}`, { method: 'DELETE' }),
};
