import axios from "axios";
import { API_URL } from "../utils/constants.js";
import { getToken } from "../utils/storage.js";

const client = axios.create({
  baseURL: API_URL
});

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function register(username, password) {
  return client.post("/api/auth/register", { username, password });
}

export function login(username, password) {
  return client.post("/api/auth/login", { username, password });
}

export function fetchMe() {
  return client.get("/api/auth/me");
}

export function uploadAvatar(avatarDataUrl) {
  return client.post("/api/auth/avatar", { avatarDataUrl });
}

export default client;
