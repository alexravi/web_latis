import api from './api';
import type { Conversation, Message, ConversationListResponse, MessageListResponse, MessageReaction } from '../types/message';

// --- Conversations ---

export const getConversations = async (limit = 50, offset = 0): Promise<ConversationListResponse> => {
    const response = await api.get('/messages/conversations', { params: { limit, offset } });
    return response.data;
};

export const getConversationDetails = async (conversationId: number | string): Promise<{ success: true; data: Conversation }> => {
    const response = await api.get(`/messages/conversations/${conversationId}`);
    return response.data;
};

export const createConversation = async (recipientId: number | string): Promise<{ success: true; data: Conversation }> => {
    const response = await api.post('/messages/conversations', { recipient_id: Number(recipientId) });
    return response.data;
};

export const deleteConversation = async (conversationId: number | string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/messages/conversations/${conversationId}`);
    return response.data;
};

export const markConversationRead = async (conversationId: number | string): Promise<{ success: boolean; message: string }> => {
    const response = await api.put(`/messages/conversations/${conversationId}/read`);
    return response.data;
};

export const getUnreadCount = async (): Promise<{ success: true; data: { unread_count: number } }> => {
    const response = await api.get('/messages/unread-count');
    return response.data;
};

// --- Messages ---

export const getMessages = async (conversationId: number | string, limit = 50, offset = 0): Promise<MessageListResponse> => {
    const response = await api.get(`/messages/conversations/${conversationId}/messages`, { params: { limit, offset } });
    return response.data;
};

interface SendMessagePayload {
    content: string;
    attachment_url?: string;
    attachment_type?: string;
    attachment_name?: string;
}

export const sendMessage = async (conversationId: number | string, payload: SendMessagePayload): Promise<{ success: true; message: string; data: Message }> => {
    // Backend validation requires conversation_id or recipient_id in body
    const response = await api.post(`/messages/conversations/${conversationId}/messages`, {
        conversation_id: Number(conversationId),
        ...payload
    });
    return response.data;
};

export const sendMessageNew = async (recipientId: number | string, payload: SendMessagePayload): Promise<{ success: true; message: string; data: Message }> => {
    // Alternative endpoint calling /messages directly if no conversation exists yet, OR createConversation then send.
    // The docs mentioned POST /api/messages as an alternative.
    const response = await api.post('/messages', {
        recipient_id: Number(recipientId),
        ...payload
    });
    return response.data;
};

export const editMessage = async (messageId: number | string, content: string): Promise<{ success: true; message: string; data: Message }> => {
    const response = await api.put(`/messages/${messageId}`, { content });
    return response.data;
};

export const deleteMessage = async (messageId: number | string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
};

export const forwardMessage = async (messageId: number | string, recipientId: number | string, conversationId?: number | string, content?: string): Promise<{ success: true; message: string; data: Message }> => {
    const response = await api.post(`/messages/${messageId}/forward`, {
        recipient_id: recipientId,
        conversation_id: conversationId,
        content
    });
    return response.data;
};

export const searchMessages = async (query: string, conversationId?: number | string): Promise<MessageListResponse> => {
    const response = await api.get('/messages/search', { params: { q: query, conversation_id: conversationId } });
    return response.data;
};

// --- Reactions ---

export const addReaction = async (messageId: number | string, reactionType: string): Promise<{ success: true; message: string; data: { message_id: number; reaction_type: string; reactions: MessageReaction[] } }> => {
    const response = await api.post(`/messages/${messageId}/reactions`, { reaction_type: reactionType });
    return response.data;
};

export const removeReaction = async (messageId: number | string, reactionType: string): Promise<{ success: true; message: string; data: { message_id: number; reaction_type: string; reactions: MessageReaction[] } }> => {
    const response = await api.delete(`/messages/${messageId}/reactions/${reactionType}`);
    return response.data;
};

// --- User Status ---

export const getUserStatus = async (userId: number | string): Promise<{ success: true; data: { user_id: number; is_online: boolean; last_seen_at: string; updated_at: string } }> => {
    const response = await api.get(`/users/${userId}/status`);
    return response.data;
};
