
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getConnections,
    getFollowers,
    getFollowing,
    sendConnectionRequest,
    removeConnection,
} from '../services/relationshipService';
import toast from 'react-hot-toast';

export const relationshipKeys = {
    all: ['relationships'] as const,
    connections: (status: string) => [...relationshipKeys.all, 'connections', status] as const,
    followers: (userId: string | number) => [...relationshipKeys.all, 'followers', userId] as const,
    following: (userId: string | number) => [...relationshipKeys.all, 'following', userId] as const,
};

export const useConnections = (status: 'connected' | 'pending') => {
    return useQuery({
        queryKey: relationshipKeys.connections(status),
        queryFn: () => getConnections(status),
    });
};

export const useFollowers = (userId: string | number, limit = 50, offset = 0) => {
    return useQuery({
        queryKey: [...relationshipKeys.followers(userId), limit, offset],
        queryFn: () => getFollowers(userId, limit, offset),
        enabled: !!userId
    });
};

export const useFollowing = (userId: string | number, limit = 50, offset = 0) => {
    return useQuery({
        queryKey: [...relationshipKeys.following(userId), limit, offset],
        queryFn: () => getFollowing(userId, limit, offset),
        enabled: !!userId
    });
};

export const useConnectMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string | number) => sendConnectionRequest(userId),
        onSuccess: () => {
            toast.success('Connection request sent');
            queryClient.invalidateQueries({ queryKey: relationshipKeys.all });
        }
    });
};

export const useCancelConnectionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string | number) => removeConnection(userId),
        onSuccess: () => {
            toast.success('Connection request withdrawn');
            queryClient.invalidateQueries({ queryKey: relationshipKeys.all });
        }
    });
};
