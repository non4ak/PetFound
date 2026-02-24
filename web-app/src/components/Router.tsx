import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AppSuspense } from "@/components/AppSuspense";
import { AuthRouter } from "@/routers/AuthRouter";
import { MainRouter } from "@/routers/MainRouter";

const router = createBrowserRouter([
    {
        path: "",
        element: <AppSuspense />,
        children: [
            AuthRouter,
            MainRouter,
            {
                path: "*",
                element: <Navigate to="/" replace />,
          ***REMOVED***,
        ],
  ***REMOVED***,
]);

export default function Router() {
    return (
        <RouterProvider router={router} />
    );
}