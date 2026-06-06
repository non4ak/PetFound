export const ROUTES = {
    LOGIN: "/login",
    SIGNUP: "/signup",
    NOT_FOUND: "/404",

    HOME: "/",
    SETTINGS: "/settings",
    USERS: "/users",
    ANNOUNCEMENTS: "/announcements",
    COMMENTS: "/comments",
}

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];