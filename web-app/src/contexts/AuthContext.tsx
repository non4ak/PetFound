import { createContext, useContext, useEffect, useState } from "react";
import axios, { type AxiosError } from "axios";

import { setUnauthorizedHandler } from "@/api/axios-client";
import { useAuthRefresh } from "@/data/hooks/auth";
import { logoutQuery } from "@/data/queries/auth";
import type { AuthUser } from "@/types/auth";

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
    login: (user: AuthUser) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const refreshQuery = useAuthRefresh();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [sessionOverride, setSessionOverride] = useState<boolean | null>(null);
    const isInitializing = refreshQuery.isLoading && sessionOverride === null;
    const isAuthenticated = sessionOverride ?? refreshQuery.isSuccess;

    useEffect(() => {
        const clearSession = (): void => {
            setSessionOverride(false);
            setUser(null);
        };

        setUnauthorizedHandler(clearSession);

        return () => {
            setUnauthorizedHandler(null);
        };
    }, []);

    const login = (nextUser: AuthUser) => {
        setSessionOverride(true);
        setUser(nextUser);
    };

    const logout = async (): Promise<void> => {
        try {
            await logoutQuery();
        } catch (error) {
            if (!axios.isAxiosError(error)) {
                throw error;
            }

            const statusCode = (error as AxiosError).response?.status;
            if (statusCode !== 400 && statusCode !== 401) {
                throw error;
            }
        }

        setSessionOverride(false);
        setUser(null);
    };

    const value = {
        isAuthenticated,
        isInitializing,
        login,
        logout,
        user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
