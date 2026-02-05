import api from './api';
import type { UserProfile } from './profileService';

export interface RelationshipUser extends UserProfile {
    id: number;
    username?: string;
    profile_picture?: string;
}

// Connections
export const sendConnectionRequest = async (userId: number | string) => {
    const response = await api.post(`/users/${userId}/connect`);
    return response.data;
};

export const acceptConnectionRequest = async (requesterId: number | string) => {
    const response = await api.post(`/users/${requesterId}/connect/accept`);
    return response.data;
};

export const declineConnectionRequest = async (requesterId: number | string) => {
    const response = await api.post(`/users/${requesterId}/connect/decline`);
    return response.data;
};

export const removeConnection = async (userId: number | string) => {
    // Also used for cancelling outgoing requests
    const response = await api.delete(`/users/${userId}/connect`);
    return response.data;
};

export const cancelConnectionRequest = async (userId: number | string) => {
    return removeConnection(userId);
};

export const getConnections = async (status: 'connected' | 'pending') => {
    try {
        const response = await api.get(`/users/me/connections`, { params: { status } });
        const data = response.data;

        let connectionsList = [];
        // Handle { success: true, data: [...] } structure
        if (data && Array.isArray(data.data)) {
            connectionsList = data.data;
        } else if (Array.isArray(data)) {
            connectionsList = data;
        }

        // Map API response to RelationshipUser interface
        const mappedConnections = connectionsList.map((conn: any) => ({
            id: conn.connection_id || conn.id, // Fallback to id if connection_id is missing, but API says connection_id
            username: conn.connection_username,
            first_name: conn.connection_first_name,
            last_name: conn.connection_last_name,
            profile_picture: conn.connection_profile_image,
            headline: conn.headline, // Assuming headline might be available or undefined
            // Include original fields if needed for debugging or other uses
            ...conn
        }));

        return { count: mappedConnections.length, data: mappedConnections };
    } catch (error) {
        console.error(`[relationshipService] Error fetching connections (${status}):`, error);
        throw error;
    }
};

export const getIncomingRequests = async () => {
    const response = await api.get(`/users/me/connection-requests/incoming`);
    return response.data;
};

export const getOutgoingRequests = async () => {
    const response = await api.get(`/users/me/connection-requests/outgoing`);
    return response.data;
};

// Follows
export const followUser = async (userId: number | string) => {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
};

export const unfollowUser = async (userId: number | string) => {
    const response = await api.delete(`/users/${userId}/follow`);
    return response.data;
};

export const getFollowers = async (userId: number | string, limit = 50, offset = 0) => {
    const response = await api.get(`/users/${userId}/followers`, { params: { limit, offset } });
    const data = response.data;

    // Handle { success: true, data: [...] } structure
    if (data && Array.isArray(data.data)) {
        return { count: data.data.length, data: data.data, pagination: data.pagination };
    }

    if (Array.isArray(data)) {
        return { count: data.length, data: data };
    }
    return data;
};

export const getFollowing = async (userId: number | string, limit = 50, offset = 0) => {
    const response = await api.get(`/users/${userId}/following`, { params: { limit, offset } });
    const data = response.data;

    // Handle { success: true, data: [...] } structure
    if (data && Array.isArray(data.data)) {
        return { count: data.data.length, data: data.data, pagination: data.pagination };
    }

    if (Array.isArray(data)) {
        return { count: data.length, data: data };
    }
    return data;
};

// Blocks
export const blockUser = async (userId: number | string) => {
    const response = await api.post(`/users/${userId}/block`);
    return response.data;
};

export const unblockUser = async (userId: number | string) => {
    const response = await api.delete(`/users/${userId}/block`);
    return response.data;
};

export const getBlockedUsers = async (limit = 50, offset = 0) => {
    const response = await api.get(`/users/me/blocks`, { params: { limit, offset } });
    return response.data;
};
