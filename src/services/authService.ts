// src/services/authService.ts
import api from './api';

interface RegisterData {
    username: string;
    email: string;
    password: string;
}

interface LoginData {
    username: string;
    password: string;
}

export const register = (data: RegisterData) =>
    api.post('/auth/register', data);

export const login = (data: LoginData) =>
    api.post(
        '/auth/login',
        new URLSearchParams({
            username: data.username,
            password: data.password,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
