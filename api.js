window.API_BASE = window.API_BASE || "http://localhost:3000";

async function apiGet(path) {
  const res = await fetch(window.API_BASE + path);
  if (!res.ok) throw new Error("Request failed: " + res.status);
  return res.json();
}

window.apiGet = apiGet;