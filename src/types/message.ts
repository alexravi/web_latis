export interface MessageUser {
    id: number;
    first_name: string;
    last_name: string;
    profile_image_url?: string;
    headline?: string;
    is_online?: boolean;
    last_seen_at?: string;
}

export interface Conversation {
    id: number;
    participant1_id: number;
    participant2_id: number;
    other_user_id?: number; // Helper from backend list response
    other_user_first_name?: string;
    other_user_last_name?: string;
    other_user_profile_image?: string;
    unread_count: number;
    last_message_at?: string; // ISO date
    last_message_content?: string;
    last_message_sender_id?: number;
    other_user?: MessageUser; // detailed object
    other_participant?: MessageUser; // alternate name in details endpoint
    created_at: string;
}

export interface MessageReaction {
    reaction_type: string;
    count: number;
    users: {
        user_id: number;
        first_name: string;
        last_name: string;
        profile_image_url?: string;
    }[];
}

export interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    content: string;
    is_read?: boolean;
    read_at?: string;
    delivered_at?: string;
    delivery_status: 'sent' | 'delivered' | 'read';
    created_at: string;
    updated_at?: string;
    deleted_at?: string;

    // Sender info (sometimes populated directly)
    first_name?: string;
    last_name?: string;
    profile_image_url?: string;

    // Attachments
    attachment_url?: string;
    attachment_type?: 'image' | 'document' | 'video' | 'audio';
    attachment_name?: string;

    // Forwarding
    forwarded_from_message_id?: number;
    original_sender?: {
        id: number;
        first_name: string;
        last_name: string;
    };

    reactions?: MessageReaction[];
}

export interface ConversationListResponse {
    success: boolean;
    data: Conversation[];
    pagination: {
        limit: number;
        offset: number;
        count: number;
    };
}

export interface MessageListResponse {
    success: boolean;
    data: Message[];
    pagination: {
        limit: number;
        offset: number;
        count: number;
    };
}
