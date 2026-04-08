import { z } from "zod";

const allowedUserNamePattern = /^[A-Za-z0-9\-._@+]+$/;

export const signInSchema = z.object({
    login: z.string().min(1, "Required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signUpSchema = z.object({
    email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
    username: z.string()
        .trim()
        .min(3, "Username must be at least 3 characters long")
        .regex(
            allowedUserNamePattern,
            "Username can contain only letters, numbers, and - . _ @ + symbols"
        ),
    password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .refine((value) => /[a-z]/.test(value), {
            message: "Password must contain at least one lowercase letter",
        })
        .refine((value) => /[A-Z]/.test(value), {
            message: "Password must contain at least one uppercase letter",
        })
        .refine((value) => /\d/.test(value), {
            message: "Password must contain at least one digit",
        })
        .refine((value) => new Set(value).size >= 3, {
            message: "Password must contain at least 3 unique characters",
        }),
    confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
