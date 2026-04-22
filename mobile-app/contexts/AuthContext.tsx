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
import {
  clearStoredOnboardingActive,
  readStoredOnboardingActive,
  writeStoredOnboardingActive,
} from '@/storage/auth-storage';
import type { AuthSession, AuthUser, PendingEmailConfirmation } from '@/types/auth';

interface AuthContextValue {
  completeSignIn: (session: AuthSession) => Promise<void>;
  clearPendingEmailConfirmation: () => void;
  finishOnboarding: () => Promise<void>;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isOnboardingActive: boolean;
  logout: () => Promise<void>;
  pendingEmailConfirmation: PendingEmailConfirmation | null;
  prepareEmailConfirmation: (confirmation: PendingEmailConfirmation) => void;
  startOnboarding: () => Promise<void>;
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isOnboardingActive, setIsOnboardingActive] = useState<boolean>(false);
  const [pendingEmailConfirmation, setPendingEmailConfirmation] =
    useState<PendingEmailConfirmation | null>(null);
  const [session, setSession] = useState<AuthSession | null>(getAuthSession());

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = subscribeToAuthSession(setSession);

    const initializeAuthSession = async (): Promise<void> => {
      try {
        await bootstrapAuthSession();

        let nextIsOnboardingActive: boolean = false;

        try {
          nextIsOnboardingActive = await readStoredOnboardingActive();
        } catch {
          await clearStoredOnboardingActive();
        }

        if (isMounted) {
          setIsOnboardingActive(nextIsOnboardingActive);
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    void initializeAuthSession();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setAuthRefreshHandler(refreshAuthSession);

    return () => {
      setAuthRefreshHandler(null);
    };
  }, []);

  const completeSignIn = async (nextSession: AuthSession): Promise<void> => {
    await persistAuthSession(nextSession);
    setPendingEmailConfirmation(null);
  };

  const clearPendingEmailConfirmation = (): void => {
    setPendingEmailConfirmation(null);
  };

  const finishOnboarding = async (): Promise<void> => {
    await clearStoredOnboardingActive();
    setIsOnboardingActive(false);
  };

  const logout = async (): Promise<void> => {
    await clearAuthSession();
  };

  const prepareEmailConfirmation = (confirmation: PendingEmailConfirmation): void => {
    setPendingEmailConfirmation(confirmation);
  };

  const startOnboarding = async (): Promise<void> => {
    await writeStoredOnboardingActive(true);
    setIsOnboardingActive(true);
  };

  const value: AuthContextValue = {
    completeSignIn,
    clearPendingEmailConfirmation,
    finishOnboarding,
    isAuthenticated: session !== null,
    isInitializing,
    isOnboardingActive,
    logout,
    pendingEmailConfirmation,
    prepareEmailConfirmation,
    startOnboarding,
    user: session?.user ?? null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context: AuthContextValue | null = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
