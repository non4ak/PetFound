import { useMutation, useQuery, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { SignInSchema, SignUpSchema } from "@/utils/validations/authSchema";
import type { AuthUser } from "@/types/auth";
import { loginQuery, logoutQuery, refreshSessionQuery, registerQuery } from "../queries/auth";

export const useAuthLogin = (options?: Partial<UseMutationOptions<AuthUser, AxiosError, SignInSchema>>) => {
    return useMutation({
        mutationFn: loginQuery,
        ...options,
    });
};

export const useAuthRegister = (options?: Partial<UseMutationOptions<AxiosResponse, AxiosError, SignUpSchema>>) => {
    return useMutation({
        mutationFn: registerQuery,
        ...options,
    });
};

export const useAuthLogout = (options?: Partial<UseMutationOptions<AxiosResponse, AxiosError, void>>) => {
    return useMutation({
        mutationFn: logoutQuery,
        ...options,
    });
};

export const useAuthRefresh = () => {
    return useQuery({
        queryFn: refreshSessionQuery,
        queryKey: ["auth", "refresh"],
        refetchOnWindowFocus: false,
        retry: false,
    });
};
