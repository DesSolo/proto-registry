// src/api/client.js
const API_BASE = 'http://127.0.0.1:8080';

/**
 * Универсальный клиент для вызова API.
 * @param {string} endpoint — путь без базового URL (например, '/v1/projects')
 * @param {Object} options — опции fetch
 * @returns {Promise<any>}
 */
export const apiClient = async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    return res.json();
};