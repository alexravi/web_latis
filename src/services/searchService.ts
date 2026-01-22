import api from './api';
import type { SearchFilters, SearchResponse, UniversalSearchResponse, AutocompleteResponse, Person, Organization, College, Group, Topic } from '../types/search.ts';

export const searchService = {
    // Universal Search
    search: async (filters: SearchFilters): Promise<UniversalSearchResponse> => {
        const params = new URLSearchParams();
        params.append('q', filters.q);
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.offset) params.append('offset', filters.offset.toString());
        if (filters.type) params.append('type', filters.type);

        const response = await api.get(`/search?${params.toString()}`);
        return response.data;
    },

    // Specific Type Searches
    searchPeople: async (filters: SearchFilters): Promise<SearchResponse<Person>> => {
        const params = new URLSearchParams();
        params.append('q', filters.q);
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.offset) params.append('offset', filters.offset.toString());
        if (filters.location) params.append('location', filters.location);
        if (filters.specialization) params.append('specialization', filters.specialization);
        if (filters.current_role) params.append('current_role', filters.current_role);

        const response = await api.get(`/search/users?${params.toString()}`);
        return response.data;
    },

    searchOrganizations: async (filters: SearchFilters): Promise<SearchResponse<Organization>> => {
        const params = new URLSearchParams();
        params.append('q', filters.q);
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.offset) params.append('offset', filters.offset.toString());
        if (filters.organization_type) params.append('organization_type', filters.organization_type);
        if (filters.location) params.append('location', filters.location);
        if (filters.specialty) params.append('specialty', filters.specialty);

        const response = await api.get(`/search/organizations?${params.toString()}`);
        return response.data;
    },

    searchColleges: async (filters: SearchFilters): Promise<SearchResponse<College>> => {
        const params = new URLSearchParams();
        params.append('q', filters.q);
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.offset) params.append('offset', filters.offset.toString());
        if (filters.location) params.append('location', filters.location);
        if (filters.institution_type) params.append('institution_type', filters.institution_type);

        const response = await api.get(`/search/colleges?${params.toString()}`);
        return response.data;
    },

    searchGroups: async (filters: SearchFilters): Promise<SearchResponse<Group>> => {
        const params = new URLSearchParams();
        params.append('q', filters.q);
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.offset) params.append('offset', filters.offset.toString());
        if (filters.group_type) params.append('group_type', filters.group_type);
        if (filters.specialty) params.append('specialty', filters.specialty);
        if (filters.location) params.append('location', filters.location);

        const response = await api.get(`/search/groups?${params.toString()}`);
        return response.data;
    },

    searchHashtags: async (filters: SearchFilters): Promise<SearchResponse<Topic>> => {
        const params = new URLSearchParams();
        params.append('q', filters.q);
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.offset) params.append('offset', filters.offset.toString());

        const response = await api.get(`/search/hashtags?${params.toString()}`);
        return response.data;
    },

    // Autocomplete
    autocomplete: async (q: string, limit_per_type: number = 5): Promise<AutocompleteResponse> => {
        const params = new URLSearchParams();
        params.append('q', q);
        params.append('limit_per_type', limit_per_type.toString());

        const response = await api.get(`/search/autocomplete?${params.toString()}`);
        return response.data;
    }
};
