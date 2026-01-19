import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { getFeed, getPostById } from '../services/postService';
import { createComment } from '../services/commentService';
import type { Post, PaginatedResponse } from '../types/PostTypes';
import toast from 'react-hot-toast';

// Query keys
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
};

// Hook to get posts with pagination support
export const usePosts = (options?: { limit?: number; offset?: number; sort?: string }) => {
  return useQuery({
    queryKey: postKeys.list(options || {}),
    queryFn: () => getFeed(options?.sort, options?.limit, options?.offset),
    staleTime: 1000 * 60 * 2, // 2 minutes for feed
  });
};

// Hook for infinite scroll
export const useInfinitePosts = (limit = 20, sort = 'new') => {
  return useInfiniteQuery<PaginatedResponse<Post>, Error>({
    queryKey: postKeys.list({ limit, sort, type: 'infinite' }),
    queryFn: ({ pageParam = 0 }) => getFeed(sort, limit, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // API should likely return null/undefined if no more pages, or we check array length
      if (lastPage.data.length < limit) {
        return undefined;
      }
      return lastPage.pagination.offset + limit; // Assuming pagination.offset is current offset
    },
    staleTime: 1000 * 60 * 2,
  });
};

// Hook to get a single post by ID
export const usePost = (id: number | null) => {
  return useQuery({
    queryKey: postKeys.detail(id!),
    queryFn: () => getPostById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// Hook to add a comment to a post
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, content, parentCommentId }: { postId: number; content: string; parentCommentId?: number }) =>
      createComment(postId, content, parentCommentId),
    onSuccess: (_data, variables) => {
      // Invalidate post queries to refetch with new comment
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      toast.success('Comment added successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to add comment';
      toast.error(message);
    },
  });
};
