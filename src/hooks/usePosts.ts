import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { getPosts, getPostById, addComment } from '../services/postService';
import toast from 'react-hot-toast';

// Query keys
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};

// Hook to get posts with pagination support
export const usePosts = (options?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: postKeys.list(options || {}),
    queryFn: () => getPosts(),
    staleTime: 1000 * 60 * 2, // 2 minutes for feed
  });
};

// Hook for infinite scroll (when backend supports pagination)
export const useInfinitePosts = (limit = 20) => {
  return useInfiniteQuery({
    queryKey: postKeys.lists(),
    queryFn: ({ pageParam = 0 }) => getPosts({ offset: pageParam, limit }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // If last page has fewer items than limit, we've reached the end
      if (lastPage.length < limit) {
        return undefined;
      }
      return allPages.length * limit;
    },
    staleTime: 1000 * 60 * 2,
  });
};

// Hook to get a single post by ID
export const usePost = (id: string | null) => {
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
    mutationFn: ({ postId, content, parentCommentId }: { postId: string; content: string; parentCommentId?: string }) =>
      addComment(postId, content, parentCommentId),
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
