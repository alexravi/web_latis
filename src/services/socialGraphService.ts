import api from './api';

// Types
export interface SocialUser {
    id: number;
    first_name: string;
    last_name: string;
    headline?: string;
    profile_image_url?: string;
    mutual_count?: number;
    visit_count?: number;
    last_visited_at?: string;
}

export interface NetworkStats {
    connections: {
        connection_count: number;
        outgoing_requests: number;
        incoming_requests: number;
    };
    follows: {
        follower_count: number;
        following_count: number;
        mutual_follows_count: number;
    };
}

export interface VisitStats {
    total_visits: number;
    unique_visitors: number;
}

export interface RelationshipPath {
    degree: number | null;
    path: number[];
    message: string;
}

export const socialGraphService = {
    // Mutual Connections
    getMutualConnections: async (userId: number | string) => {
        const response = await api.get(`/social-graph/mutual-connections/${userId}`);
        const data = response.data;
        if (Array.isArray(data)) {
            return { count: data.length, data: data };
        }
        return data;
    },

    // Network Stats
    getNetworkStats: async (userId?: number | string) => {
        const url = userId ? `/social-graph/network-stats/${userId}` : '/social-graph/network-stats';
        const response = await api.get(url);
        return response.data;
    },

    // Suggestions
    getSuggestions: async (limit: number = 20) => {
        const response = await api.get(`/social-graph/suggestions?limit=${limit}`);
        return response.data;
    },

    // Relationship Path
    getRelationshipPath: async (userId: number | string) => {
        const response = await api.get(`/social-graph/relationship-path/${userId}`);
        return response.data;
    },

    // Second Degree Connections
    getSecondDegreeConnections: async (userId: number | string, limit: number = 50) => {
        const response = await api.get(`/social-graph/second-degree/${userId}?limit=${limit}`);
        const data = response.data;
        if (Array.isArray(data)) {
            return { count: data.length, data: data };
        }
        return data;
    },

    // Profile Visitors (Only for own profile)
    getProfileVisitors: async (userId: number | string, limit: number = 50, offset: number = 0) => {
        const response = await api.get(`/social-graph/profile-visitors/${userId}?limit=${limit}&offset=${offset}`);
        const data = response.data;
        if (Array.isArray(data)) {
            return { count: data.length, data: data };
        }
        return data;
    },

    // Visited Profiles
    getVisitedProfiles: async (limit: number = 50, offset: number = 0) => {
        const response = await api.get(`/social-graph/visited-profiles?limit=${limit}&offset=${offset}`);
        const data = response.data;
        if (Array.isArray(data)) {
            return { count: data.length, data: data };
        }
        return data;
    },

    // Visit Stats (Only for own profile)
    getVisitStats: async (userId: number | string) => {
        const response = await api.get(`/social-graph/visit-stats/${userId}`);
        return response.data;
    }
};
