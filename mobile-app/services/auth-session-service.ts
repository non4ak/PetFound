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
  } catch {
    await clearAuthSession();
    return null;
  }

  if (storedSession === null) {
    clearCurrentAuthSession();
    return null;
  }

  setCurrentAuthSession(storedSession);

  try {
    const refreshedSession: AuthSession = await refreshSessionQuery(storedSession.tokens.refreshToken);

    await persistAuthSession(refreshedSession);

    return refreshedSession;
  } catch (error) {
    if (isUnauthorizedApiError(error)) {
      await clearAuthSession();
      return null;
    }

    return storedSession;
  }
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
  }

  try {
    const refreshedSession: AuthSession = await refreshSessionQuery(
      currentSession.tokens.refreshToken,
    );

    await persistAuthSession(refreshedSession);

    return true;
  } catch (error) {
    if (isUnauthorizedApiError(error)) {
      await clearAuthSession();
      return false;
    }

    throw error;
  }
}
