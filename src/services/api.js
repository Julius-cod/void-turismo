import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export function authHeader(token){
  return { Authorization: `Bearer ${token}` };
}

export default api;
