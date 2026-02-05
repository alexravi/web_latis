import { useInfiniteQuery } from '@tanstack/react-query';
import { activityService, type ActivityType } from '../services/activityService';

export const activityKeys = {
    all: ['activities'] as const,
    feed: (type?: ActivityType) => [...activityKeys.all, 'feed', type] as const,
    user: (userId: number | string, type?: ActivityType) => [...activityKeys.all, 'user', userId, type] as const,
    me: (type?: ActivityType) => [...activityKeys.all, 'me', type] as const,
};

export const useInfiniteFeed = (limit: number = 10, type?: ActivityType, options?: { enabled?: boolean }) => {
    return useInfiniteQuery({
        queryKey: activityKeys.feed(type),
        queryFn: ({ pageParam = 0 }) => activityService.getFeed(limit, pageParam as number, type),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            // Check if we hit the limit or have no more data
            const currentOffset = lastPage.pagination?.offset || 0;
            const currentLimit = lastPage.pagination?.limit || limit;

            // If the number of items returned is less than limit, we are done
            if (lastPage.data.length < currentLimit) return undefined;

            // Otherwise, next offset is current offset + limit
            return currentOffset + currentLimit;
        },
        enabled: options?.enabled,
    });
};

export const useUserActivities = (userId: number | string, limit: number = 10, type?: ActivityType, options?: { enabled?: boolean }) => {
    return useInfiniteQuery({
        queryKey: activityKeys.user(userId, type),
        queryFn: ({ pageParam = 0 }) => activityService.getUserActivities(userId, limit, pageParam as number, type),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const currentOffset = lastPage.pagination?.offset || 0;
            const currentLimit = lastPage.pagination?.limit || limit;
            if (lastPage.data.length < currentLimit) return undefined;
            return currentOffset + currentLimit;
        },
        enabled: options?.enabled ?? !!userId, // Default to enabled if userId is present, unless explicitly disabled
    });
};
