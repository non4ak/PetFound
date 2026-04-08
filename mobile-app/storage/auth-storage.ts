import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AuthSession } from '@/types/auth';

const AUTH_SESSION_STORAGE_KEY = 'auth.session';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!isRecord(value)) {
    return false;
***REMOVED***

  if (!isRecord(value.user) || !isRecord(value.tokens)) {
    return false;
***REMOVED***

  return (
    typeof value.user.email === 'string' &&
    typeof value.user.role === 'string' &&
    typeof value.user.userName === 'string' &&
    typeof value.tokens.accessToken === 'string' &&
    typeof value.tokens.refreshToken === 'string'
  );
}

function parseAuthSession(value: string): AuthSession {
  const parsedValue: unknown = JSON.parse(value);

  if (!isAuthSession(parsedValue)) {
    throw new Error('Stored auth session has an invalid shape.');
***REMOVED***

  return parsedValue;
}

export async function clearStoredAuthSession(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export async function readStoredAuthSession(): Promise<AuthSession | null> {
  const storedValue: string | null = await AsyncStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (storedValue === null) {
    return null;
***REMOVED***

  return parseAuthSession(storedValue);
}

export async function writeStoredAuthSession(session: AuthSession): Promise<void> {
  const serializedSession: string = JSON.stringify(session);

  await AsyncStorage.setItem(AUTH_SESSION_STORAGE_KEY, serializedSession);
}
