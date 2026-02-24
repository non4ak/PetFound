import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export const AppSuspense = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
        </Suspense>
    );
};