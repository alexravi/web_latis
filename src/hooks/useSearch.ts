import { useQuery } from '@tanstack/react-query';
import { searchService } from '../services/searchService';
import type { SearchFilters } from '../types/search';
import { useMemo } from 'react';

// Query keys
export const searchKeys = {
  all: ['search'] as const,
  universal: (filters: SearchFilters) => [...searchKeys.all, 'universal', filters] as const,
  people: (filters: SearchFilters) => [...searchKeys.all, 'people', filters] as const,
  organizations: (filters: SearchFilters) => [...searchKeys.all, 'organizations', filters] as const,
  colleges: (filters: SearchFilters) => [...searchKeys.all, 'colleges', filters] as const,
  groups: (filters: SearchFilters) => [...searchKeys.all, 'groups', filters] as const,
  hashtags: (filters: SearchFilters) => [...searchKeys.all, 'hashtags', filters] as const,
  autocomplete: (query: string) => [...searchKeys.all, 'autocomplete', query] as const,
};

const useDebouncedFilters = (filters: SearchFilters) => {
  return useMemo(() => {
    if (!filters.q || filters.q.length < 2) {
      return null;
    }
    return filters;
  }, [filters.q, JSON.stringify(filters)]); // Deep compare other filters if needed
};

export const useUniversalSearch = (filters: SearchFilters) => {
  const debouncedFilters = useDebouncedFilters(filters);
  return useQuery({
    queryKey: searchKeys.universal(debouncedFilters || filters),
    queryFn: () => searchService.search(debouncedFilters || filters),
    enabled: !!debouncedFilters,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchPeople = (filters: SearchFilters) => {
  const debouncedFilters = useDebouncedFilters(filters);
  return useQuery({
    queryKey: searchKeys.people(debouncedFilters || filters),
    queryFn: () => searchService.searchPeople(debouncedFilters || filters),
    enabled: !!debouncedFilters,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchOrganizations = (filters: SearchFilters) => {
  const debouncedFilters = useDebouncedFilters(filters);
  return useQuery({
    queryKey: searchKeys.organizations(debouncedFilters || filters),
    queryFn: () => searchService.searchOrganizations(debouncedFilters || filters),
    enabled: !!debouncedFilters,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchColleges = (filters: SearchFilters) => {
  const debouncedFilters = useDebouncedFilters(filters);
  return useQuery({
    queryKey: searchKeys.colleges(debouncedFilters || filters),
    queryFn: () => searchService.searchColleges(debouncedFilters || filters),
    enabled: !!debouncedFilters,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchGroups = (filters: SearchFilters) => {
  const debouncedFilters = useDebouncedFilters(filters);
  return useQuery({
    queryKey: searchKeys.groups(debouncedFilters || filters),
    queryFn: () => searchService.searchGroups(debouncedFilters || filters),
    enabled: !!debouncedFilters,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchHashtags = (filters: SearchFilters) => {
  const debouncedFilters = useDebouncedFilters(filters);
  return useQuery({
    queryKey: searchKeys.hashtags(debouncedFilters || filters),
    queryFn: () => searchService.searchHashtags(debouncedFilters || filters),
    enabled: !!debouncedFilters,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAutocomplete = (query: string) => {
  return useQuery({
    queryKey: searchKeys.autocomplete(query),
    queryFn: () => searchService.autocomplete(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
};
