import api from './api';
import type { Consult, Message } from '../types/ConsultTypes';

export interface GetConsultsParams {
    status?: 'ACTIVE' | 'ARCHIVED' | 'FLAGGED';
    limit?: number;
    offset?: number;
}

export const getConsults = async (params?: GetConsultsParams): Promise<Consult[]> => {
    try {
        const response = await api.get('/consults', {
            params: {
                status: params?.status,
                limit: params?.limit || 20,
                offset: params?.offset || 0,
            },
        });
        return response.data.data || response.data || [];
    } catch (error) {
        console.error('Error fetching consults:', error);
        return [];
    }
};

export const getConsultById = async (id: string): Promise<Consult | undefined> => {
    try {
        const response = await api.get(`/consults/${id}`);
        return response.data.data || response.data;
    } catch (error) {
        console.error('Error fetching consult:', error);
        return undefined;
    }
};

export const createConsult = async (data: {
    participantIds: string[];
    subject: string;
    urgency?: 'URGENT' | 'ROUTINE';
}): Promise<Consult> => {
    const response = await api.post('/consults', data);
    return response.data.data || response.data;
};

export const getConsultMessages = async (
    consultId: string,
    options?: { limit?: number; offset?: number }
): Promise<Message[]> => {
    try {
        const response = await api.get(`/consults/${consultId}/messages`, {
            params: {
                limit: options?.limit || 50,
                offset: options?.offset || 0,
            },
        });
        return response.data.data || response.data || [];
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
};

export const sendMessage = async (consultId: string, content: string): Promise<Message> => {
    const response = await api.post(`/consults/${consultId}/messages`, { content });
    return response.data.data || response.data;
};

export const markConsultAsRead = async (consultId: string): Promise<void> => {
    await api.put(`/consults/${consultId}/read`);
};

export const updateConsultStatus = async (
    consultId: string,
    status: 'ACTIVE' | 'ARCHIVED' | 'FLAGGED'
): Promise<Consult> => {
    const response = await api.put(`/consults/${consultId}/status`, { status });
    return response.data.data || response.data;
};
