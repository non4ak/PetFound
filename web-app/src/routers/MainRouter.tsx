import type { RouteObject } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Home } from "@/pages/main/Home";
import { Settings } from "@/pages/main/Settings";
import { MainLayout } from "@/components/MainLayout";
import { ProtectedGuard } from "@/components/Guards";

export const MainRouter: RouteObject = {
    element: (
        <ProtectedGuard>
            <MainLayout />
        </ProtectedGuard>
    ),
    children: [
        {
            path: ROUTES.HOME,
            element: <Home />,
      ***REMOVED***,
        {
            path: ROUTES.SETTINGS,
            element: <Settings />,
      ***REMOVED***,
    ],
};