// src/services/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const raw = localStorage.getItem('user');
    if (raw) {
        try {
            const parsed = JSON.parse(raw); // { email, token }
            const token = parsed.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            console.warn("🔐 Erreur de parsing du token JWT", e);
        }
    }
    return config;
});

export default api;
