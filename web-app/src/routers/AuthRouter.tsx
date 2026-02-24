import type { RouteObject } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Login } from "@/pages/auth/Login";
import { SignUp } from "@/pages/auth/SignUp";
import { GuestLoader } from "@/utils/Loaders";

export const AuthRouter: RouteObject = {
    children: [
        {
            path: ROUTES.LOGIN,
            element: <Login />,
            loader: GuestLoader,
        },
        {
            path: ROUTES.SIGNUP,
            element: <SignUp />,
            loader: GuestLoader,
        },
    ],
};
