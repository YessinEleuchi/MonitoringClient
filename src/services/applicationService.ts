// src/services/authService.ts
import api from './api';

export interface Application {
    id: number;
    name?: string;
    status :string;
    base_url: string;
    description?: string;
    auth_type?: 'none' | 'basic' | 'jwt';
    auth_url?: string;
    auth_credentials?: string;
    headers?: string;
}

export interface ApplicationStats {
    app_id: number;
    success_rate: number;
    avg_response_time: number;
    last_updated: string;
    endpoints: number;
    last_health_check: string;
}

export interface DailyStat {
    date: string;
    avg_response_time: number;
    success_rate: number;
}

// 🔹 Application CRUD
export const listApplications = () =>
    api.get<Application[]>('/applications/');

export const getApplication = (id: number) =>
    api.get<Application>(`/applications/${id}`);

export const createApplication = (data: Application) =>
    api.post<Application>('/applications/', data);

export const updateApplication = (id: number, data: Partial<Application>) =>
    api.put<Application>(`/applications/${id}`, data);

export const deleteApplication = (id: number) =>
    api.delete(`/applications/${id}`);

// 🔹 Statistiques
export const getAppStats = (id: number) =>
    api.get<ApplicationStats>(`/stats/url/${id}`);

export const getWeeklyStats = (id: number) =>
    api.get<DailyStat[]>(`/stats/weekly/${id}`);

export const getAllStats = () =>
    api.get<{
        total_applications: number;
        total_endpoints: number;
        applications: ApplicationStats[];
    }>('/stats/stats/all');
