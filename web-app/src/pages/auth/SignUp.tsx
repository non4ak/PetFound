import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpSchema } from "@/utils/validations/authSchema";
import { useAuthRegister } from "@/data/hooks/auth";
import { getApiErrorMessage } from "@/utils/apiError";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { PasswordInput } from "@/components/ui/PasswordInput";

export const SignUp = () => {
    const { mutateAsync: registerUser, isPending } = useAuthRegister({
        onSuccess: (_response, variables) => {
            reset();
            toast.success(`Account created for ${variables.email}. Confirm the email before logging in.`);
      ***REMOVED***,
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Registration failed"));
      ***REMOVED***
  ***REMOVED***);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
  ***REMOVED*** = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
  ***REMOVED***);

    const onSubmit = async (data: SignUpSchema) => {
        await registerUser(data);
  ***REMOVED***;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <TextInput
                        {...register("username")}
                        error={errors.username?.message}
                        label="Username"
                        placeholder="Enter your username"
                        type="text"
                    />

                    <TextInput
                        {...register("email")}
                        error={errors.email?.message}
                        label="Email"
                        placeholder="Enter your email"
                        type="email"
                    />

                    <PasswordInput
                        {...register("password")}
                        error={errors.password?.message}
                        helperText="Minimum 6 characters, with uppercase, lowercase, digit, and at least 3 unique characters."
                        label="Password"
                        placeholder="Create a password"
                    />

                    <PasswordInput
                        {...register("confirmPassword")}
                        error={errors.confirmPassword?.message}
                        label="Confirm Password"
                        placeholder="Confirm your password"
                    />

                    <Button fullWidth isLoading={isPending} type="submit" variant="success">
                        {isPending ? "Creating account..." : "Sign Up"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline font-medium">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};
