import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, getUserProfileById, updateProfile, type CompleteProfileData } from '../services/profileService';
import toast from 'react-hot-toast';

// Query keys
export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
  user: (id: string | number) => [...profileKeys.all, 'user', id] as const,
};

// Hook to get current user's profile
export const useProfile = () => {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to get a specific user's profile
export const useUserProfile = (id: string | number | null) => {
  return useQuery({
    queryKey: profileKeys.user(id!),
    queryFn: () => getUserProfileById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// Hook to update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompleteProfileData) => updateProfile(data),
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    },
  });
};
