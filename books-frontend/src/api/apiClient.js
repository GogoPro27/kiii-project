const base = import.meta.env.VITE_API_BASE + "/api";
console.log("base", base);

async function request(path, options = {}) {
  const res = await fetch(`${base}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      err = { message: res.statusText };
    }
    throw Object.assign(new Error(err.message || "Request failed"), {
      status: res.status,
      details: err,
    });
  }
  if (res.status === 204) return null;
  return res.json();
}

export const booksApi = {
  list: (q = "", page = 0, size = 20) =>
    request(`/books?q=${encodeURIComponent(q)}&page=${page}&size=${size}`),
  getOne: (id) => request(`/books/${id}`),
  create: (data) =>
    request("/books", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/books/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/books/${id}`, { method: "DELETE" }),
};
