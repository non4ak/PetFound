import type { AuthSession } from '@/types/auth';

let currentAuthSession: AuthSession | null = null;
const authSessionListeners = new Set<(session: AuthSession | null) => void>();

function notifyAuthSessionListeners(session: AuthSession | null): void {
  authSessionListeners.forEach((listener) => {
    listener(session);
***REMOVED***);
}

export function clearCurrentAuthSession(): void {
  currentAuthSession = null;
  notifyAuthSessionListeners(null);
}

export function getCurrentAuthSession(): AuthSession | null {
  return currentAuthSession;
}

export function setCurrentAuthSession(session: AuthSession): void {
  currentAuthSession = session;
  notifyAuthSessionListeners(session);
}

export function subscribeToAuthSession(
  listener: (session: AuthSession | null) => void,
): () => void {
  authSessionListeners.add(listener);

  return (): void => {
    authSessionListeners.delete(listener);
***REMOVED***;
}
