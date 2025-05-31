// src/services/endpointService.ts
import api from './api';

export interface EndpointBase {
    url: string;
    name?: string;
    description?: string;
    method: string;
    headers?: Record<string, string>;
    use_auth: boolean;
    body?: Record<string, string>;
    body_format?: string;
    expected_status: number;
    response_format: string;
    response_conditions?: ResponseCondition[];
}

export interface Endpoint extends EndpointBase {
    id: number;
    application_id: number;
    accuracy?: number;
    error_rate?: number;
    availability?: number;
}

export interface ResponseCondition {
    field: string;
    condition: 'equals' | 'not_null' | 'contains';
    value?: string | number | boolean;
}

export interface EndpointResult {
    timestamp: string;
    status_code: number;
    response_time: number;
    success: boolean;
    response_content?: Record<string, string>;
    error_message?: string;
}

export const listEndpoints = () =>
    api.get<Endpoint[]>('/endpoints/');

export const getEndpoint = (id: number) =>
    api.get<Endpoint>(`/endpoints/${id}`);

export const createEndpoint = (data: Omit<Endpoint, 'id'>) =>
    api.post<Endpoint>('/endpoints/', data);

export const updateEndpoint = (id: number, data: Partial<Endpoint>) =>
    api.put<Endpoint>(`/endpoints/${id}`, data);

export const deleteEndpoint = (id: number) =>
    api.delete(`/endpoints/${id}`);

export const testEndpoint = (id: number) =>
    api.post<EndpointResult>(`/endpoints/${id}/test`);
