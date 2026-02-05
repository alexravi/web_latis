import { useQuery } from '@tanstack/react-query';
import { socialGraphService, type NetworkStats, type VisitStats, type SocialUser } from '../services/socialGraphService';

export const socialKeys = {
    all: ['social'] as const,
    networkStats: (userId?: number | string) => [...socialKeys.all, 'networkStats', userId] as const,
    suggestions: () => [...socialKeys.all, 'suggestions'] as const,
    mutualConnections: (userId: number | string) => [...socialKeys.all, 'mutualConnections', userId] as const,
    visitStats: (userId: number | string) => [...socialKeys.all, 'visitStats', userId] as const,
    profileVisitors: (userId: number | string) => [...socialKeys.all, 'profileVisitors', userId] as const,
};

// Network Stats
export const useNetworkStats = (userId?: number | string) => {
    return useQuery<NetworkStats>({
        queryKey: socialKeys.networkStats(userId),
        queryFn: () => socialGraphService.getNetworkStats(userId),
        enabled: true, // Always attempt fetch if mounted, logic handles userId check internally if needed
    });
};

// Suggestions
export const useSuggestions = (limit: number = 5) => {
    return useQuery<SocialUser[]>({
        queryKey: socialKeys.suggestions(),
        queryFn: async () => {
            const data = await socialGraphService.getSuggestions(limit);
            if (Array.isArray(data)) return data;
            // If the service returns { count, data: [...] } or { data: [...] }
            if (data && Array.isArray((data as any).data)) return (data as any).data;
            return [];
        },
    });
};

// Visit Stats
export const useVisitStats = (userId: number | string) => {
    return useQuery<VisitStats>({
        queryKey: socialKeys.visitStats(userId),
        queryFn: async () => {
            const data = await socialGraphService.getVisitStats(userId);
            return data;
        },
        enabled: !!userId,
    });
};

// Profile Visitors
export const useProfileVisitors = (userId: number | string, limit: number = 50) => {
    return useQuery({
        queryKey: socialKeys.profileVisitors(userId),
        queryFn: () => socialGraphService.getProfileVisitors(userId, limit),
        enabled: !!userId,
    });
};

// Mutual Connections
export const useMutualConnections = (userId: number | string) => {
    return useQuery({
        queryKey: socialKeys.mutualConnections(userId),
        queryFn: () => socialGraphService.getMutualConnections(userId),
        enabled: !!userId,
    });
};
