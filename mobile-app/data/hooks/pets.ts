import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import { createPetQuery, deletePetQuery, getMyPetsQuery, updatePetQuery } from '@/data/queries/pets';
import type { CreatePetRequest, Pet } from '@/types/pet';

export const myPetsQueryKey = ['pets', 'me'] as const;

export function useMyPetsQuery(): UseQueryResult<Pet[], Error> {
  return useQuery({
    queryFn: getMyPetsQuery,
    queryKey: myPetsQueryKey,
***REMOVED***);
}

export function useCreatePetMutation(): UseMutationResult<Pet, Error, CreatePetRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPetQuery,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: myPetsQueryKey });
  ***REMOVED***,
***REMOVED***);
}

export function useDeletePetMutation(): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePetQuery,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: myPetsQueryKey });
  ***REMOVED***,
***REMOVED***);
}

export function useUpdatePetMutation(): UseMutationResult<
  void,
  Error,
  { id: number; data: CreatePetRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updatePetQuery(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: myPetsQueryKey });
  ***REMOVED***,
***REMOVED***);
}
