import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export const SignUp = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h1>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="Create a password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
                    >
                        Sign Up
                    </button>
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