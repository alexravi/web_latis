export interface User {
    id: number;
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
    headline: string | null;
}

export interface Comment {
    id: number;
    post_id: number;
    user_id: number;
    content: string;
    parent_comment_id: number | null;
    upvotes_count: number;
    downvotes_count: number;
    replies_count: number;
    user_vote: 'upvote' | 'downvote' | null;
    is_edited: boolean;
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
    created_at: string;
    edited_at?: string;
    replies?: Comment[];
}

export type PostType = 'post' | 'article' | 'discussion';
export type Visibility = 'public' | 'connections' | 'private';

export interface Post {
    id: number;
    user_id: number;
    content: string;
    post_type: PostType;
    visibility: Visibility;
    upvotes_count: number;
    downvotes_count: number;
    comments_count: number;
    shares_count: number;
    is_pinned: boolean;
    is_edited: boolean;
    is_repost?: boolean;
    parent_post_id?: number;
    original_post?: Post;
    user_vote: 'upvote' | 'downvote' | null;
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
    headline: string | null;
    created_at: string;
    edited_at?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}

export interface SingleResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}
