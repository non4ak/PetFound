import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useForm } from "react-hook-form";
import type { SignInSchema } from "@/utils/validations/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/utils/validations/authSchema";
import { useAuthLogin } from "@/data/hooks/auth";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/utils/apiError";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { PasswordInput } from "@/components/ui/PasswordInput";

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
