import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { subscribeToAuthSession } from '@/api/auth-session';
import { setAuthRefreshHandler } from '@/api/axios-client';
import {
  bootstrapAuthSession,
  clearAuthSession,
  getAuthSession,
  persistAuthSession,
  refreshAuthSession,
} from '@/services/auth-session-service';
import type { AuthSession, AuthUser } from '@/types/auth';

interface AuthContextValue {
  completeSignIn: (session: AuthSession) => Promise<void>;
  isAuthenticated: boolean;
  isInitializing: boolean;
  logout: () => Promise<void>;
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [session, setSession] = useState<AuthSession | null>(getAuthSession());

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = subscribeToAuthSession(setSession);

    const initializeAuthSession = async (): Promise<void> => {
      try {
        await bootstrapAuthSession();
    ***REMOVED*** finally {
        if (isMounted) {
          setIsInitializing(false);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***;

    void initializeAuthSession();

    return () => {
      isMounted = false;
      unsubscribe();
  ***REMOVED***;
***REMOVED***, []);

  useEffect(() => {
    setAuthRefreshHandler(refreshAuthSession);

    return () => {
      setAuthRefreshHandler(null);
  ***REMOVED***;
***REMOVED***, []);

  const completeSignIn = async (nextSession: AuthSession): Promise<void> => {
    await persistAuthSession(nextSession);
***REMOVED***;

  const logout = async (): Promise<void> => {
    await clearAuthSession();
***REMOVED***;

  const value: AuthContextValue = {
    completeSignIn,
    isAuthenticated: session !== null,
    isInitializing,
    logout,
    user: session?.user ?? null,
***REMOVED***;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context: AuthContextValue | null = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
***REMOVED***

  return context;
}
