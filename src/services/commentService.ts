import api from './api';
import type { Comment, PaginatedResponse, SingleResponse } from '../types/PostTypes';

export const createComment = async (postId: number, content: string, parentCommentId: number | null = null): Promise<Comment> => {
    const response = await api.post<SingleResponse<Comment>>('/comments', {
        content,
        post_id: postId,
        parent_comment_id: parentCommentId
    });
    return response.data.data;
};

export const getPostComments = async (postId: number, sort = 'best', tree = true, limit = 50, offset = 0): Promise<Comment[] | PaginatedResponse<Comment>> => {
    // If tree is true, returns Comment[] wrapped in data
    // If tree is false, returns PaginatedResponse
    const response = await api.get(`/posts/${postId}/comments`, {
        params: { sort, tree, limit, offset }
    });
    return response.data.data;
};

export const getCommentById = async (id: number, sort = 'best', tree = true): Promise<Comment> => {
    const response = await api.get<SingleResponse<Comment>>(`/comments/${id}`, {
        params: { sort, tree }
    });
    return response.data.data;
};

export const updateComment = async (id: number, content: string): Promise<Comment> => {
    const response = await api.put<SingleResponse<Comment>>(`/comments/${id}`, { content });
    return response.data.data;
};

export const deleteComment = async (id: number): Promise<void> => {
    await api.delete(`/comments/${id}`);
};

// --- Voting ---

export const upvoteComment = async (id: number): Promise<Comment> => {
    const response = await api.post<SingleResponse<Comment>>(`/comments/${id}/upvote`);
    return response.data.data;
};

export const downvoteComment = async (id: number): Promise<Comment> => {
    const response = await api.post<SingleResponse<Comment>>(`/comments/${id}/downvote`);
    return response.data.data;
};

export const removeCommentVote = async (id: number): Promise<Comment> => {
    const response = await api.delete<SingleResponse<Comment>>(`/comments/${id}/vote`);
    return response.data.data;
};
