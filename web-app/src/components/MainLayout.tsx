import { Outlet, Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

export const MainLayout = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const handleLogout = async (): Promise<void> => {
        await logout();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col w-full">
            {/* Top Navigation Bar */}
            <header className="bg-white shadow border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex text-center items-center font-bold text-xl text-blue-600">
                            LostPet
                        </div>
                        <nav className="flex space-x-8 items-center">
                            <Link
                                to={ROUTES.HOME}
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === ROUTES.HOME ? "border-blue-500 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                            >
                                Home
                            </Link>
                            <Link
                                to={ROUTES.SETTINGS}
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === ROUTES.SETTINGS ? "border-blue-500 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                            >
                                Settings
                            </Link>
                            <Button
                                className="ml-4"
                                onClick={() => {
                                    void handleLogout();
                                }}
                                size="sm"
                                variant="danger"
                            >
                                Logout
                            </Button>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
