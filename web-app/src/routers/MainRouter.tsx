import type { RouteObject } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Home } from "@/pages/main/Home";
import { Settings } from "@/pages/main/Settings";
import { MainLayout } from "@/components/MainLayout";
import { ProtectedGuard } from "@/components/Guards";
import { Users } from "@/pages/main/Users";
import { Announcements } from "@/pages/main/Announcements";
import { Comments } from "@/pages/main/Comments";

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
        },
        {
            path: ROUTES.SETTINGS,
            element: <Settings />,
        },
        {
            path: ROUTES.USERS,
            element: <Users />,
        },
        {
            path: ROUTES.ANNOUNCEMENTS,
            element: <Announcements />,
        },
        {
            path: ROUTES.COMMENTS,
            element: <Comments />,
        }
    ],
};