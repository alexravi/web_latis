export type Urgency = 'ROUTINE' | 'URGENT' | 'STAT';

export interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
    isRead: boolean;
    attachments?: string[];
}

export interface Consult {
    id: string;
    participants: {
        id: string;
        name: string;
        role: string;
        avatar?: string;
    }[];
    subject: string; // "Case ID" or "Topic"
    urgency: Urgency;
    lastMessage: Message;
    messages: Message[];
    status: 'ACTIVE' | 'ARCHIVED' | 'FLAGGED';
}
