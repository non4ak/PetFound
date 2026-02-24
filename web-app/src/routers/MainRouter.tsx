import type { RouteObject } from "react-router-dom";
import { ProtectedLoader } from "@/utils/Loaders";
import { ROUTES } from "@/constants/routes";
import { Home } from "@/pages/main/Home";
import { Settings } from "@/pages/main/Settings";
import { MainLayout } from "@/components/MainLayout";

export const MainRouter: RouteObject = {
    loader: ProtectedLoader,
    element: <MainLayout />,
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