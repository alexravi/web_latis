import { useQuery } from '@tanstack/react-query';
import { searchService, type SearchFilters } from '../services/searchService';
import { useMemo } from 'react';

// Query keys
export const searchKeys = {
  all: ['search'] as const,
  queries: () => [...searchKeys.all, 'query'] as const,
  query: (filters: SearchFilters) => [...searchKeys.queries(), filters] as const,
};

// Hook for search with debouncing (debouncing handled by React Query's built-in debouncing)
export const useSearch = (filters: SearchFilters) => {
  // Memoize filters to prevent unnecessary re-renders
  const debouncedFilters = useMemo(() => {
    if (!filters.q || filters.q.length < 2) {
      return null; // Don't search for very short queries
    }
    return filters;
  }, [filters.q, filters.type, filters.limit, filters.offset]);

  return useQuery({
    queryKey: searchKeys.query(debouncedFilters || filters),
    queryFn: () => searchService.search(debouncedFilters || filters),
    enabled: !!debouncedFilters && debouncedFilters.q.length >= 2,
    staleTime: 1000 * 60 * 5, // Cache search results for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });
};
