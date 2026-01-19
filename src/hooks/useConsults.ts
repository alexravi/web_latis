import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConsults, getConsultById, sendMessage } from '../services/consultService';
import toast from 'react-hot-toast';

// Query keys
export const consultKeys = {
  all: ['consults'] as const,
  lists: () => [...consultKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...consultKeys.lists(), filters] as const,
  details: () => [...consultKeys.all, 'detail'] as const,
  detail: (id: string) => [...consultKeys.details(), id] as const,
};

// Hook to get all consults
export const useConsults = (filters?: { status?: 'ACTIVE' | 'ARCHIVED' | 'FLAGGED' }) => {
  return useQuery({
    queryKey: consultKeys.list(filters || {}),
    queryFn: () => getConsults(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Hook to get a single consult by ID
export const useConsult = (id: string | null) => {
  return useQuery({
    queryKey: consultKeys.detail(id!),
    queryFn: () => getConsultById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 1, // 1 minute for active conversations
  });
};

// Hook to send a message
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ consultId, content }: { consultId: string; content: string }) =>
      sendMessage(consultId, content),
    onSuccess: (_data, variables) => {
      // Invalidate consult queries to refetch with new message
      queryClient.invalidateQueries({ queryKey: consultKeys.detail(variables.consultId) });
      queryClient.invalidateQueries({ queryKey: consultKeys.lists() });
      toast.success('Message sent');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to send message';
      toast.error(message);
    },
  });
};
