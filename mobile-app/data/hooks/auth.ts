import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { loginQuery, registerQuery } from '@/data/queries/auth';
import type { AuthSession, LoginRequest, RegisterRequest } from '@/types/auth';

export function useLoginMutation(): UseMutationResult<AuthSession, Error, LoginRequest> {
  return useMutation({
    mutationFn: loginQuery,
***REMOVED***);
}

export function useRegisterMutation(): UseMutationResult<void, Error, RegisterRequest> {
  return useMutation({
    mutationFn: registerQuery,
***REMOVED***);
}
