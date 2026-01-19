import api from './api';

export interface SearchFilters {
    q: string;
    type?: 'all' | 'people' | 'posts' | 'companies';
    limit?: number;
    offset?: number;
}

export const searchService = {
    search: async (filters: SearchFilters) => {
        const params = new URLSearchParams();
        params.append('q', filters.q);
        if (filters.type) params.append('type', filters.type);
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.offset) params.append('offset', filters.offset.toString());

        const response = await api.get(`/search?${params.toString()}`);
        return response.data;
    },
};
