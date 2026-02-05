import api from './api';

// Types
export type ActivityType =
    | 'post_created'
    | 'comment_created'
    | 'comment_replied'
    | 'follow'
    | 'connection_accepted'
    | 'profile_updated';

export interface Activity {
    id: number;
    user_id: number;
    activity_type: ActivityType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    activity_data: any;
    related_user_id?: number | null;
    related_post_id?: number | null;
    related_comment_id?: number | null;
    related_connection_id?: number | null;
    created_at: string;
    first_name?: string;
    last_name?: string;
    profile_image_url?: string;
}

export interface ActivityFeedResponse {
    success: boolean;
    data: Activity[];
    pagination: {
        limit: number;
        offset: number;
        count: number;
    };
}

export const activityService = {
    // Get Feed
    getFeed: async (limit: number = 50, offset: number = 0, type?: ActivityType, startDate?: string, endDate?: string) => {
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        params.append('offset', offset.toString());
        if (type) params.append('type', type);
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);

        const response = await api.get(`/activities/feed?${params.toString()}`);
        // Normalize response
        if (Array.isArray(response.data)) {
            return {
                success: true,
                data: response.data,
                pagination: {
                    limit: limit,
                    offset: offset,
                    count: response.data.length
                }
            };
        }
        return response.data;
    },

    // Get My Activities
    getMyActivities: async (limit: number = 50, offset: number = 0, type?: ActivityType) => {
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        params.append('offset', offset.toString());
        if (type) params.append('type', type);

        const response = await api.get(`/activities/me?${params.toString()}`);
        if (Array.isArray(response.data)) {
            return {
                success: true,
                data: response.data,
                pagination: {
                    limit: limit,
                    offset: offset,
                    count: response.data.length
                }
            };
        }
        return response.data;
    },

    // Get User Activities
    getUserActivities: async (userId: number | string, limit: number = 50, offset: number = 0, type?: ActivityType) => {
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        params.append('offset', offset.toString());
        if (type) params.append('type', type);

        const response = await api.get(`/activities/user/${userId}?${params.toString()}`);
        if (Array.isArray(response.data)) {
            return {
                success: true,
                data: response.data,
                pagination: {
                    limit: limit,
                    offset: offset,
                    count: response.data.length
                }
            };
        }
        return response.data;
    }
};
