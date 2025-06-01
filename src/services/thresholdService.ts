// src/services/thresholdService.ts
import api from './api';

export interface Thresholds {
    id: number;
    critical_latency: number;
    critical_success_rate: number;
}

export interface ThresholdsCreate {
    critical_latency: number;
    critical_success_rate: number;
}

export interface ThresholdsUpdate {
    critical_latency?: number;
    critical_success_rate?: number;
}

export const createThresholds = (data: ThresholdsCreate) =>
    api.post<Thresholds>('/thresholds/', data);

export const listThresholds = () =>
    api.get<Thresholds>('/thresholds/');

export const updateThresholds = (data: ThresholdsUpdate) =>
    api.put<Thresholds>('/thresholds/', data);
