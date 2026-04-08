import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";

interface GuardProps {
    children: React.ReactNode;
}

export const ProtectedGuard = ({ children }: GuardProps) => {
    const { isAuthenticated, isInitializing } = useAuth();

    if (isInitializing) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="flex items-center gap-3 rounded-lg bg-white px-6 py-4 shadow">
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    <span className="text-sm font-medium text-gray-700">Checking session...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <>{children}</>;
};

export const GuestGuard = ({ children }: GuardProps) => {
    const { isAuthenticated, isInitializing } = useAuth();

    if (isInitializing) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="flex items-center gap-3 rounded-lg bg-white px-6 py-4 shadow">
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    <span className="text-sm font-medium text-gray-700">Checking session...</span>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <>{children}</>;
};
