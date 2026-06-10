import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useForm } from "react-hook-form";
import type { SignInSchema } from "@/utils/validations/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/utils/validations/authSchema";
import { useAuthLogin, useGoogleAuth } from "@/data/hooks/auth";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/utils/apiError";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { GoogleLogin } from "@react-oauth/google";

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
);

export const Login = () => {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const { mutateAsync: login, isPending } = useAuthLogin({
        onSuccess: (user) => {
            authLogin(user);
            navigate(ROUTES.HOME);
        },
        onError: (error) => {
            const message = getApiErrorMessage(error, "Login failed");
            toast.error(message);
        },
    });

    const { mutateAsync: googleAuth, isPending: isGooglePending } = useGoogleAuth({
        onSuccess: (user) => {
            authLogin(user);
            navigate(ROUTES.HOME);
        },
        onError: (error) => {
            const message = getApiErrorMessage(error, "Google login failed");
            toast.error(message);
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInSchema) => {
        await login(data);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <TextInput
                        {...register("login")}
                        error={errors.login?.message}
                        label="Email or Username"
                        placeholder="Enter your email or username"
                        type="text"
                    />

                    <PasswordInput
                        {...register("password")}
                        error={errors.password?.message}
                        label="Password"
                        placeholder="Enter your password"
                    />

                    <Button fullWidth isLoading={isPending} type="submit" variant="primary">
                        {isPending ? "Logging in..." : "Log In"}
                    </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-5 gap-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400 font-medium">or continue with</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Google button */}
                <div className={`flex justify-center transition-opacity ${isGooglePending ? "opacity-50 pointer-events-none" : ""}`}>
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            if (credentialResponse.credential) {
                                await googleAuth(credentialResponse.credential);
                            }
                        }}
                        onError={() => toast.error("Google sign-in was cancelled or failed")}
                        width="368"
                        theme="outline"
                        shape="rectangular"
                        text="signin_with"
                        logo_alignment="center"
                    />
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to={ROUTES.SIGNUP} className="text-blue-600 hover:underline font-medium">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};