export interface SearchPagination {
    limit: number;
    offset: number;
    hasMore?: boolean;
    total?: number;
}

import type { RelationshipStatus } from './relationship';

export interface Person {
    id: number;
    first_name: string;
    last_name: string;
    headline?: string;
    profile_image_url?: string;
    specialization?: string;
    location?: string;
    current_role?: string;
    is_verified?: boolean;
    connection_count?: number;
    follower_count?: number;
    username?: string; // For routing
    relationship?: RelationshipStatus;
}

export interface Organization {
    id: number;
    name: string;
    organization_type: string;
    description?: string;
    logo_url?: string;
    location?: string;
    city?: string;
    state?: string;
    country?: string;
    employee_count?: number;
    is_verified?: boolean;
    specialties?: string[];
}

export interface College {
    name: string;
    institution_type: string;
    location: string;
    alumni_count?: number;
    source: 'education' | 'organization';
}

export interface Group {
    id: number;
    name: string;
    description?: string;
    group_type: string;
    specialty?: string;
    logo_url?: string;
    location?: string;
    member_count?: number;
    is_verified?: boolean;
}

export interface Topic {
    id: number;
    name: string;
    description?: string;
    posts_count: number;
}

export interface PostResult {
    id: number;
    content: string;
    user_id: number;
    first_name: string;
    last_name: string;
    created_at: string;
    username?: string;
}

export interface Job {
    id: number;
    title: string;
    organization_name: string;
    // Add more fields as needed
}

export interface SearchFilters {
    q: string;
    limit?: number;
    offset?: number;
    type?: string; // Comma separated for universal search
    // Specific filters
    location?: string;
    specialization?: string;
    current_role?: string;
    organization_type?: string;
    specialty?: string;
    institution_type?: string;
    group_type?: string;
}

export interface SearchResponse<T> {
    success: boolean;
    data: T[];
    pagination: SearchPagination;
}

export interface UniversalSearchData {
    people?: Person[];
    companies?: Organization[];
    colleges?: College[];
    groups?: Group[];
    topics?: Topic[];
    posts?: PostResult[];
    jobs?: Job[];
}

export interface UniversalSearchResponse {
    success: boolean;
    data: UniversalSearchData;
    pagination: SearchPagination;
}

export interface AutocompleteResponse {
    success: boolean;
    data: UniversalSearchData;
}
