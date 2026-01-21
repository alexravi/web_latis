import type { Consult, Message, Urgency } from '../types/ConsultTypes';
import {
    getConversations,
    getConversationDetails,
    getMessages,
    sendMessage as sendChatMessage,
    createConversation,
    markConversationRead
} from './messageService';

/* 
 * Adapter Service: Maps Messaging API (Conversations) to Consults Interface 
 * purely on the frontend to avoid 404s until a dedicated Consults API exists.
 */

export interface GetConsultsParams {
    status?: 'ACTIVE' | 'ARCHIVED' | 'FLAGGED';
    limit?: number;
    offset?: number;
}

const mapConversationToConsult = (conv: any): Consult => {
    // Try to get user from nested object, or fallback to flat fields
    const otherUser = conv.other_user || conv.other_participant;
    const firstName = otherUser?.first_name || conv.other_user_first_name || 'Unknown';
    const lastName = otherUser?.last_name || conv.other_user_last_name || 'User';
    const fullName = `${firstName} ${lastName}`.trim();
    const role = otherUser?.headline || 'User';
    const avatar = otherUser?.profile_image_url || conv.other_user_profile_image;
    const participantId = (otherUser?.id || conv.other_user_id || '').toString();

    return {
        id: conv.id.toString(),
        participants: participantId ? [{
            id: participantId,
            name: fullName,
            role: role,
            avatar: avatar
        }] : [],
        subject: `Conversation ${conv.id}`, // Placeholder
        urgency: 'ROUTINE', // Placeholder
        lastMessage: {
            id: 'latest', // Placeholder
            senderId: conv.last_message_sender_id?.toString() || '',
            content: conv.last_message_content || '',
            timestamp: conv.last_message_at || conv.created_at,
            isRead: conv.unread_count === 0,
        },
        messages: [],
        status: 'ACTIVE' // Placeholder
    };
};

export const getConsults = async (params?: GetConsultsParams): Promise<Consult[]> => {
    try {
        const res = await getConversations(params?.limit, params?.offset);
        const conversations = Array.isArray(res) ? res : (res.data || []);

        // Filter or transform if needed. For now, all conversations are "consults"
        return conversations.map(mapConversationToConsult);
    } catch (error) {
        console.error('Error fetching consults (conversations):', error);
        return [];
    }
};

export const getConsultById = async (id: string): Promise<Consult | undefined> => {
    try {
        const res = await getConversationDetails(id);
        if (!res.data) return undefined;
        return mapConversationToConsult(res.data);
    } catch (error) {
        console.error('Error fetching consult:', error);
        return undefined;
    }
};

export const createConsult = async (data: {
    participantIds: string[];
    subject: string;
    urgency?: Urgency;
}): Promise<Consult> => {
    // Only support single recipient for now via createConversation
    if (data.participantIds.length === 0) throw new Error("No participant selected");

    // Create conversation with the first participant
    const res = await createConversation(data.participantIds[0]);

    // We can't set subject/urgency in messaging API, so we send the subject as the first message
    if (data.subject) {
        await sendChatMessage(res.data.id, { content: `Subject: ${data.subject} (${data.urgency || 'ROUTINE'})` });
    }

    return mapConversationToConsult(res.data);
};

export const getConsultMessages = async (
    consultId: string,
    options?: { limit?: number; offset?: number }
): Promise<Message[]> => {
    try {
        const res = await getMessages(consultId, options?.limit, options?.offset);
        const messages = Array.isArray(res) ? res : (res.data || []);

        return messages.map((msg: any) => ({
            id: msg.id.toString(),
            senderId: msg.sender_id.toString(),
            content: msg.content,
            timestamp: msg.created_at,
            isRead: msg.is_read || false,
            attachments: msg.attachment_url ? [msg.attachment_url] : []
        }));
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
};

export const sendMessage = async (consultId: string, content: string): Promise<Message> => {
    const res = await sendChatMessage(consultId, { content });
    return {
        id: res.data.id.toString(),
        senderId: res.data.sender_id.toString(),
        content: res.data.content,
        timestamp: res.data.created_at,
        isRead: false, // Sent message is unread by other initially
        attachments: res.data.attachment_url ? [res.data.attachment_url] : []
    };
};

export const markConsultAsRead = async (consultId: string): Promise<void> => {
    await markConversationRead(consultId);
};

export const updateConsultStatus = async (
    consultId: string,
    status: 'ACTIVE' | 'ARCHIVED' | 'FLAGGED'
): Promise<Consult> => {
    console.warn("Update Status not fully supported in Messaging API. Local mock only.");
    // In a real app we might delete or mute. For now, just re-fetch to strict contract.
    const consult = await getConsultById(consultId);
    if (!consult) throw new Error("Consult not found");
    return { ...consult, status };
};
