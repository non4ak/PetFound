import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { getUserById, updateUser } from "@/data/queries/users";
import type { FullUserDto, UpdateUserDto } from "@/types/users";

const NOTIFICATION_LABELS: Record<number, string> = {
    0: "Email and push",
    1: "Email only",
    2: "Push only",
};

interface DetailedUserProps {
    userId: number;
    onClose: () => void;
    onDeactivate: (id: number, userName: string) => void;
    onActivate: (id: number, userName: string) => void;
    onDelete: (id: number, userName: string) => void;
    onUpdated: () => void;
}

interface InfoRowProps {
    label: string;
    value: string | number | boolean | null | undefined;
    mono?: boolean;
}

const InfoRow = ({ label, value, mono }: InfoRowProps) => {
    const display =
        value === null || value === undefined
            ? <span className="text-gray-400 italic">—</span>
            : typeof value === "boolean"
            ? (
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${value ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {value ? "✓ Yes" : "✗ No"}
                </span>
            )
            : <span className={mono ? "font-mono text-xs" : ""}>{String(value)}</span>;

    return (
        <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide shrink-0 w-44">{label}</span>
            <span className="text-sm text-gray-800 text-right">{display}</span>
        </div>
    );
};

export const DetailedUser = ({
    userId,
    onClose,
    onDeactivate,
    onActivate,
    onDelete,
    onUpdated,
}: DetailedUserProps) => {
    const [user, setUser] = useState<FullUserDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState<UpdateUserDto>({
        country: null,
        city: null,
        socialNetwork: null,
        phoneNumber: null,
        notificationChannelPreference: 0,
    });

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUserById(userId);
            setUser(data);
            setForm({
                country: data.country,
                city: data.city,
                socialNetwork: data.socialNetwork,
                phoneNumber: data.phoneNumber,
                notificationChannelPreference: data.notificationChannelPreference,
            });
        } catch {
            setError("Failed to load user details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load();
    }, [userId]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        setError(null);
        try {
            await updateUser(user.id, form);
            await load();
            setIsEditing(false);
            onUpdated();
        } catch {
            setError("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = <K extends keyof UpdateUserDto>(key: K, value: UpdateUserDto[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const isDeactivated = user
        ? user.lockoutEnabled && user.lockoutEnd !== null && new Date(user.lockoutEnd) > new Date()
        : false;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {loading ? "Loading…" : user?.userName ?? "User"}
                        </h2>
                        {user && (
                            <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
                        )}
                    </div>
                    <button
                        className="text-gray-400 hover:text-gray-600 text-xl font-bold ml-4"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-6 py-4">
                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="h-8 rounded-lg bg-gray-100 animate-pulse" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-red-600 text-sm bg-red-50 rounded-xl p-3">{error}</div>
                    ) : user ? (
                        isEditing ? (
                            /* ── Edit Form ── */
                            <div className="space-y-4">
                                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">
                                    Editable fields
                                </p>

                                {[
                                    { key: "country" as const, label: "Country", placeholder: "e.g. Ukraine" },
                                    { key: "city" as const, label: "City", placeholder: "e.g. Kyiv" },
                                    { key: "phoneNumber" as const, label: "Phone number", placeholder: "+380..." },
                                    { key: "socialNetwork" as const, label: "Social network", placeholder: "https://..." },
                                ].map(({ key, label, placeholder }) => (
                                    <div key={key}>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                                        <input
                                            type="text"
                                            value={form[key] ?? ""}
                                            onChange={(e) => updateField(key, e.target.value || null)}
                                            placeholder={placeholder}
                                            className="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                ))}

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Notification channel
                                    </label>
                                    <select
                                        value={form.notificationChannelPreference}
                                        onChange={(e) => updateField("notificationChannelPreference", Number(e.target.value))}
                                        className="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        {Object.entries(NOTIFICATION_LABELS).map(([k, v]) => (
                                            <option key={k} value={k}>{v}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ) : (
                            /* ── View ── */
                            <div className="space-y-1">
                                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3">
                                    Account
                                </p>
                                <InfoRow label="ID" value={user.id} />
                                <InfoRow label="Username" value={user.userName} />
                                <InfoRow label="Email" value={user.email} />
                                <InfoRow label="Roles" value={user.roles.join(", ")} />
                                <InfoRow label="Registered" value={new Date(user.registeredAt).toLocaleString()} />

                                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium pt-4 pb-1">
                                    Profile
                                </p>
                                <InfoRow label="Country" value={user.country} />
                                <InfoRow label="City" value={user.city} />
                                <InfoRow label="Phone" value={user.phoneNumber} />
                                <InfoRow label="Social network" value={user.socialNetwork} />
                                <InfoRow
                                    label="Notifications"
                                    value={user.notificationChannelPreferenceLabel}
                                />

                                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium pt-4 pb-1">
                                    Security
                                </p>
                                <InfoRow label="Email confirmed" value={user.emailConfirmed} />
                                <InfoRow label="Phone confirmed" value={user.phoneNumberConfirmed} />
                                <InfoRow label="2FA enabled" value={user.twoFactorEnabled} />
                                <InfoRow label="Lockout enabled" value={user.lockoutEnabled} />
                                <InfoRow label="Lockout end" value={user.lockoutEnd ? new Date(user.lockoutEnd).toLocaleString() : null} />
                                <InfoRow label="Failed login count" value={user.accessFailedCount} />
                            </div>
                        )
                    ) : null}
                </div>

                {/* Footer actions */}
                {user && !loading && (
                    <div className="px-6 py-4 border-t border-gray-100 space-y-2">
                        {isEditing ? (
                            <div className="flex gap-2">
                                <Button variant="primary" className="flex-1" isLoading={isSaving} onClick={() => void handleSave()}>
                                    Save changes
                                </Button>
                                <Button variant="secondary" onClick={() => { setIsEditing(false); setError(null); }}>
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex gap-2">
                                    <Button variant="edit" className="flex-1" onClick={() => setIsEditing(true)}>
                                        Edit profile
                                    </Button>
                                    {isDeactivated ? (
                                        <Button
                                            variant="secondary"
                                            className="flex-1"
                                            onClick={() => { onClose(); onActivate(user.id, user.userName); }}
                                        >
                                            Activate
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="secondary"
                                            className="flex-1"
                                            onClick={() => { onClose(); onDeactivate(user.id, user.userName); }}
                                        >
                                            Deactivate
                                        </Button>
                                    )}
                                </div>
                                <Button
                                    variant="dangerExtra"
                                    fullWidth
                                    onClick={() => { onClose(); onDelete(user.id, user.userName); }}
                                >
                                    Delete user
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};