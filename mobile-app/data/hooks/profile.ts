import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import { getProfileQuery, updateProfileQuery } from '@/data/queries/profile';
import type { Profile, UpdateProfileRequest } from '@/types/profile';

export const profileQueryKey = ['profile'] as const;

export function useProfileQuery(): UseQueryResult<Profile, Error> {
  return useQuery({
    queryFn: getProfileQuery,
    queryKey: profileQueryKey,
  });
}

export function useUpdateProfileMutation(): UseMutationResult<
  void,
  Error,
  UpdateProfileRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileQuery,
    onSuccess: async (_result: void, variables: UpdateProfileRequest) => {
      const cachedProfile: Profile | undefined = queryClient.getQueryData(profileQueryKey);
      const nextProfile: Profile = {
        city: variables.city,
        country: variables.country,
        email: cachedProfile?.email ?? '',
        notificationChannelPreference: variables.notificationChannelPreference,
        phoneNumber: variables.phoneNumber,
        socialNetwork: variables.socialNetwork,
        userPhotoUrl: variables.userPhotoUrl ?? cachedProfile?.userPhotoUrl ?? '',
        userName: cachedProfile?.userName ?? '',
      };

      queryClient.setQueryData(profileQueryKey, nextProfile);
      await queryClient.invalidateQueries({ queryKey: profileQueryKey });
    },
  });
}
