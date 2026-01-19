import api from './api';
import type { Post, Comment } from '../types/PostTypes';

export interface GetPostsParams {
    offset?: number;
    limit?: number;
}

export const getPosts = async (options?: GetPostsParams): Promise<Post[]> => {
    try {
        const response = await api.get('/posts', {
            params: {
                offset: options?.offset || 0,
                limit: options?.limit || 20,
            },
        });
        return response.data.data || response.data || [];
    } catch (error) {
        console.error('Error fetching posts:', error);
        // Fallback to empty array on error
        return [];
    }
};

export const getPostById = async (id: string): Promise<Post | undefined> => {
    try {
        const response = await api.get(`/posts/${id}`);
        return response.data.data || response.data;
    } catch (error) {
        console.error('Error fetching post:', error);
        return undefined;
    }
};

export const createPost = async (data: { content: string; tags?: string[] }): Promise<Post> => {
    const response = await api.post('/posts', data);
    return response.data.data || response.data;
};

export const updatePost = async (id: string, data: { content?: string; tags?: string[] }): Promise<Post> => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data.data || response.data;
};

export const deletePost = async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
};

export const likePost = async (id: string): Promise<Post> => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data.data || response.data;
};

export const getPostComments = async (postId: string, options?: { offset?: number; limit?: number }): Promise<Comment[]> => {
    try {
        const response = await api.get(`/posts/${postId}/comments`, {
            params: {
                offset: options?.offset || 0,
                limit: options?.limit || 50,
            },
        });
        return response.data.data || response.data || [];
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
};

export const addComment = async (postId: string, content: string, parentCommentId?: string): Promise<Comment> => {
    const endpoint = parentCommentId 
        ? `/comments/${parentCommentId}/replies`
        : `/posts/${postId}/comments`;
    
    const response = await api.post(endpoint, { content });
    return response.data.data || response.data;
};

export const updateComment = async (id: string, content: string): Promise<Comment> => {
    const response = await api.put(`/comments/${id}`, { content });
    return response.data.data || response.data;
};

export const deleteComment = async (id: string): Promise<void> => {
    await api.delete(`/comments/${id}`);
};
