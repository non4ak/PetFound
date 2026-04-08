import type { RouteObject } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Login } from "@/pages/auth/Login";
import { SignUp } from "@/pages/auth/SignUp";
import { GuestGuard } from "@/components/Guards";

export const AuthRouter: RouteObject = {
    children: [
        {
            path: ROUTES.LOGIN,
            element: (
                <GuestGuard>
                    <Login />
                </GuestGuard>
            ),
      ***REMOVED***,
        {
            path: ROUTES.SIGNUP,
            element: (
                <GuestGuard>
                    <SignUp />
                </GuestGuard>
            ),
      ***REMOVED***,
    ],
};
