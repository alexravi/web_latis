import { QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Create a query client with production-ready configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 1000 * 60 * 5,
      // Cache data for 30 minutes after it becomes inactive
      gcTime: 1000 * 60 * 30, // Previously cacheTime
      // Retry failed requests up to 3 times with exponential backoff
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (useful for keeping data fresh)
      refetchOnWindowFocus: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: true,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      // Show error toasts for failed mutations
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.message || 'An error occurred';
        toast.error(message);
      },
    },
  },
});

// Global error handler for queries
queryClient.setMutationDefaults(['*'], {
  onError: (error: any) => {
    // Handle specific error codes
    if (error?.response?.status === 401) {
      // Token expired or invalid - handled by interceptor
      return;
    }
    if (error?.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
      return;
    }
    if (error?.response?.status === 404) {
      toast.error('Resource not found');
      return;
    }
    if (error?.response?.status === 429) {
      toast.error('Too many requests. Please try again later');
      return;
    }
    if (error?.response?.status >= 500) {
      toast.error('Server error. Please try again later');
      return;
    }
  },
});
