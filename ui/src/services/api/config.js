// src/services/api/config.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

export { API_BASE, DEFAULT_HEADERS };