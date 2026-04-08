import { Button } from "@/components/ui/Button";

export const Settings = () => {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Settings</h1>
            <p className="text-gray-600 mb-6">
                Update your application preferences and profile information here.
            </p>

            <div className="space-y-4 max-w-lg border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive an email when your pets have updates.</p>
                    </div>
                    <Button isActive variant="toggle">
                        Toggle email notifications
                    </Button>
                </div>
            </div>
        </div>
    );
};
