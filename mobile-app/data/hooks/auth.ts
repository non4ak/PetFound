import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import {
  googleLoginQuery,
  loginQuery,
  logoutQuery,
  registerQuery,
} from '@/data/queries/auth';
import type {
  AuthSession,
  GoogleLoginRequest,
  LoginRequest,
  RegisterRequest,
} from '@/types/auth';

export function useLoginMutation(): UseMutationResult<AuthSession, Error, LoginRequest> {
  return useMutation({
    mutationFn: loginQuery,
***REMOVED***);
}

export function useGoogleLoginMutation(): UseMutationResult<
  AuthSession,
  Error,
  GoogleLoginRequest
> {
  return useMutation({
    mutationFn: googleLoginQuery,
***REMOVED***);
}

export function useRegisterMutation(): UseMutationResult<void, Error, RegisterRequest> {
  return useMutation({
    mutationFn: registerQuery,
***REMOVED***);
}

export function useLogoutMutation(): UseMutationResult<void, Error, void> {
  return useMutation({
    mutationFn: logoutQuery,
***REMOVED***);
}
