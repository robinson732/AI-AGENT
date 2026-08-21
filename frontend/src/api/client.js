const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const RESTAURANT_SLUG = import.meta.env.VITE_RESTAURANT_SLUG || "Robinson";



async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}/r/${RESTAURANT_SLUG}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    const message = body?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return body;
}

export const api = {
  getMenu: () => request("/menu"),
  chat: (message) =>
    request("/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  createOrder: (customerName, items) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify({
        customer_name: customerName,
        items: items.map((it) => ({ id: it.id, qty: it.qty })),
      }),
    }),
  createReservation: ({ name, guests, reservedAt, contact, notes }) =>
    request("/reservations", {
      method: "POST",
      body: JSON.stringify({
        name,
        guests,
        reserved_at: reservedAt,
        contact,
        notes,
      }),
    }),
  getRecommendations: ({ budget, dietary, preferences } = {}) => {
    const params = new URLSearchParams();
    if (budget) params.set("budget", budget);
    if (dietary) params.set("dietary", dietary);
    if (preferences) params.set("preferences", preferences);
    const qs = params.toString();
    return request(`/recommendations${qs ? `?${qs}` : ""}`);
  },
};