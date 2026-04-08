import {
  clearCurrentAuthSession,
  getCurrentAuthSession,
  setCurrentAuthSession,
} from '@/api/auth-session';
import { refreshSessionQuery } from '@/data/queries/auth';
import {
  clearStoredAuthSession,
  readStoredAuthSession,
  writeStoredAuthSession,
} from '@/storage/auth-storage';
import type { AuthSession } from '@/types/auth';
import { isUnauthorizedApiError } from '@/utils/apiError';

export async function bootstrapAuthSession(): Promise<AuthSession | null> {
  let storedSession: AuthSession | null = null;

  try {
    storedSession = await readStoredAuthSession();
***REMOVED*** catch {
    await clearAuthSession();
    return null;
***REMOVED***

  if (storedSession === null) {
    clearCurrentAuthSession();
    return null;
***REMOVED***

  setCurrentAuthSession(storedSession);

  try {
    const refreshedSession: AuthSession = await refreshSessionQuery(storedSession.tokens.refreshToken);

    await persistAuthSession(refreshedSession);

    return refreshedSession;
***REMOVED*** catch (error) {
    if (isUnauthorizedApiError(error)) {
      await clearAuthSession();
      return null;
  ***REMOVED***

    return storedSession;
***REMOVED***
}

export async function clearAuthSession(): Promise<void> {
  await clearStoredAuthSession();
  clearCurrentAuthSession();
}

export function getAuthSession(): AuthSession | null {
  return getCurrentAuthSession();
}

export async function persistAuthSession(session: AuthSession): Promise<void> {
  await writeStoredAuthSession(session);
  setCurrentAuthSession(session);
}

export async function refreshAuthSession(): Promise<boolean> {
  const currentSession: AuthSession | null = getCurrentAuthSession();

  if (currentSession === null) {
    return false;
***REMOVED***

  try {
    const refreshedSession: AuthSession = await refreshSessionQuery(
      currentSession.tokens.refreshToken,
    );

    await persistAuthSession(refreshedSession);

    return true;
***REMOVED*** catch (error) {
    if (isUnauthorizedApiError(error)) {
      await clearAuthSession();
      return false;
  ***REMOVED***

    throw error;
***REMOVED***
}
