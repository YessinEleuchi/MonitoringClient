// src/services/emailSubscriptionService.ts
import api from './api';

export interface EmailSubscriptionCreate {
    email: string;
}

export const subscribeToNotifications = (data: EmailSubscriptionCreate) =>
    api.post<{ message: string }>('/notifications/subscribe', data);
