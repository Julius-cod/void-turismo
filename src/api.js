export const API_URL = "http://127.0.0.1:8000/api";

export async function getJSON(path, token = null) {
  const res = await fetch(API_URL + (path.startsWith('/') ? path : '/' + path), {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return res.json();
}

export async function postJSON(path, data, token = null) {
  const res = await fetch(API_URL + (path.startsWith('/') ? path : '/' + path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  });
  return res.json();
}
