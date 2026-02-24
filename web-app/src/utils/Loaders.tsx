import { redirect } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

function getTokens() {
    return {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
  ***REMOVED***;
}

export const GuestLoader = () => {
    const { accessToken } = getTokens();

    if (accessToken) {
        return redirect(ROUTES.HOME);
  ***REMOVED***

    return null;
};

export const ProtectedLoader = () => {
    const { accessToken } = getTokens();

    // if (!accessToken) {
    //     return redirect(ROUTES.LOGIN);
    // }

    return null;
};