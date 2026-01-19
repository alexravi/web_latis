import api from './api';
import type { Post, PaginatedResponse, SingleResponse, PostType, Visibility } from '../types/PostTypes';

// --- Feed & Posts ---

export const getFeed = async (sort = 'new', limit = 20, offset = 0): Promise<PaginatedResponse<Post>> => {
    const response = await api.get<PaginatedResponse<Post>>('/posts', {
        params: { sort, limit, offset }
    });
    return response.data;
};

export const getPostById = async (id: number): Promise<Post> => {
    const response = await api.get<SingleResponse<Post>>(`/posts/${id}`);
    return response.data.data;
};

export const createPost = async (content: string, postType: PostType = 'post', visibility: Visibility = 'public'): Promise<Post> => {
    const response = await api.post<SingleResponse<Post>>('/posts', {
        content,
        post_type: postType,
        visibility
    });
    return response.data.data;
};

export const updatePost = async (id: number, data: { content?: string; post_type?: PostType; visibility?: Visibility; is_pinned?: boolean }): Promise<Post> => {
    const response = await api.put<SingleResponse<Post>>(`/posts/${id}`, data);
    return response.data.data;
};

export const deletePost = async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`);
};

// --- Voting ---

export const upvotePost = async (id: number): Promise<Post> => {
    const response = await api.post<SingleResponse<Post>>(`/posts/${id}/upvote`);
    return response.data.data;
};

export const downvotePost = async (id: number): Promise<Post> => {
    const response = await api.post<SingleResponse<Post>>(`/posts/${id}/downvote`);
    return response.data.data;
};

export const removePostVote = async (id: number): Promise<Post> => {
    const response = await api.delete<SingleResponse<Post>>(`/posts/${id}/vote`);
    return response.data.data;
};

// --- Reposts ---

export const repostPost = async (id: number): Promise<Post> => {
    const response = await api.post<SingleResponse<Post>>(`/posts/${id}/repost`);
    return response.data.data;
};

export const unrepostPost = async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}/repost`);
};

export const getReposts = async (id: number, limit = 50, offset = 0): Promise<PaginatedResponse<Post>> => {
    const response = await api.get<PaginatedResponse<Post>>(`/posts/${id}/reposts`, {
        params: { limit, offset }
    });
    return response.data;
};

export const checkReposted = async (id: number): Promise<{ has_reposted: boolean; repost_id?: number }> => {
    const response = await api.get<SingleResponse<{ has_reposted: boolean; repost_id?: number }>>(`/posts/${id}/reposted`);
    return response.data.data;
};
