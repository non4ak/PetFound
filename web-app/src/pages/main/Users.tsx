import { useEffect, useState } from "react";
import { activateUser, deactivateUser, getAllUsers, deleteUser } from "@/data/queries/users";
import type { UserDto } from "@/types/users";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { DetailedUser } from "@/components/users/DetailedUser";

type ActionType = "deactivate" | "activate" | "delete";

export const Users = () => {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [search, setSearch] = useState("");
    const [pageSize, setPageSize] = useState(20);
    const [usersCount, setUsersCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [showIds, setShowIds] = useState(false);
    const [modal, setModal] = useState<{ userId: number; userName: string; action: ActionType } | null>(null);

    const loadUsers = async () => {
        try {
            setError(null);
            const data = await getAllUsers({ search, pageNumber, pageSize: pageSize || 20 });
            setUsers(data.items);
            setUsersCount(data.totalCount);
            setTotalPages(data.totalPages);
        } catch {
            setError("Failed to load users.");
        }
    };

    const handleConfirm = async () => {
        if (!modal) return;
        try {
            if (modal.action === "deactivate") await deactivateUser(modal.userId);
            if (modal.action === "activate") await activateUser(modal.userId);
            if (modal.action === "delete") await deleteUser(modal.userId);
            await loadUsers();
        } catch {
            setError(`Failed to ${modal.action} user.`);
        } finally {
            setModal(null);
        }
    };

    useEffect(() => { void loadUsers(); }, [search, pageSize, pageNumber]);

    const confirmLabels: Record<ActionType, string> = {
        deactivate: "Deactivate user",
        activate: "Activate user",
        delete: "Delete user",
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            {/* Header */}
            <div className="mb-5">
                <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Total: <span className="font-semibold text-gray-800">{usersCount}</span> users
                </p>
            </div>

            {error && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-red-700 text-sm flex items-center justify-between">
                    {error}
                    <button className="font-bold text-red-400 hover:text-red-600 ml-3" onClick={() => setError(null)}>✕</button>
                </div>
            )}

            {/* Search */}
            <div className="flex gap-4 mb-5">
                <input
                    type="text"
                    placeholder="Search by name or email…"
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 pl-4 w-72
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    onChange={(e) => { setSearch(e.target.value); setPageNumber(0); }}
                />
<div className="inline-flex items-center gap-4">
                    <p className="text-gray-600 mb-1">Toggle the visibility of IDs:</p>
                    <Button variant="toggle" isActive={showIds} onClick={() => setShowIds(!showIds)} className="opacity-50">
                        Toggle ID's
                    </Button>
                </div>
            </div>

            {/* Grid */}
            {users.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-5xl mb-3">👤</p>
                    <p className="text-lg font-medium">No users found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {users.map((user) => {
                        const isDeactivated = user.isDeactivated;
                        return (
                            <div
                                key={user.id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1.5 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setSelectedUserId(user.id)}
                            >
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mb-1">
                                    {user.userName.charAt(0).toUpperCase()}
                                </div>

                                <h3 className="text-sm font-semibold text-gray-900 truncate">{user.userName}</h3>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>

                                {/* Roles */}
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                    {(Array.isArray(user.roles) ? user.roles : [user.roles]).map((role) => (
                                        <span key={role} className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                                            {role}
                                        </span>
                                    ))}
                                </div>

                                {/* Location */}
                                {(user.country || user.city) && (
                                    <p className="text-xs text-gray-400 truncate">
                                        📍 {[user.city, user.country].filter(Boolean).join(", ")}
                                    </p>
                                )}

                                {/* Status */}
                                <div className="mt-auto pt-2">
                                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${isDeactivated ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                                        {isDeactivated ? "🔴 Deactivated" : "🟢 Active"}
                                    </span>
                                </div>

                                {showIds && <p className="text-gray-400 text-xs font-mono">ID: {user.id}</p>}
                            </div>
                        );
                    })}
                </div>
            )}

            <Pagination
                prevPage={() => { if (pageNumber > 0) setPageNumber(pageNumber - 1); }}
                nextPage={() => { if (pageNumber + 1 < totalPages) setPageNumber(pageNumber + 1); }}
                currentPage={pageNumber + 1}
                onChangeTotalPages={setPageSize}
            />

            {/* Detailed user modal */}
            {selectedUserId !== null && (
                <DetailedUser
                    userId={selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                    onDeactivate={(id, userName) => setModal({ userId: id, userName, action: "deactivate" })}
                    onActivate={(id, userName) => setModal({ userId: id, userName, action: "activate" })}
                    onDelete={(id, userName) => setModal({ userId: id, userName, action: "delete" })}
                    onUpdated={() => void loadUsers()}
                />
            )}

            {/* Confirm modal */}
            {modal && (
                <ConfirmModal
                    title={confirmLabels[modal.action]}
                    message={`Are you sure you want to ${modal.action} "${modal.userName}"?${modal.action === "delete" ? " This action is irreversible." : ""}`}
                    onCancel={() => setModal(null)}
                    onConfirm={() => void handleConfirm()}
                />
            )}
        </div>
    );
};