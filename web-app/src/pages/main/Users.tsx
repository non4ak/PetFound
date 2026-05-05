import { activateUser, deactivateUser, getAllUsers, deleteUser } from "@/data/queries/users";
import type { UserDto } from "@/types/users";
import { act, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";

export const Users = () => {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [search, setSearch] = useState("");
    const [pageSize, setPageSize] = useState(20);
    const [usersCount, setUsersCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    type actionType = "deactivate" | "activate" | "delete" | null;
    const [modal, setModal] = useState<{
        userId: number;
        action: actionType;
    } | null>(null);

    const loadUsers = async () => {
        try {
            const data = await getAllUsers({search: search, pageNumber: pageNumber, pageSize: pageSize ? pageSize : 20});
            setUsers(data.items);
            setUsersCount(data.totalCount);
            setTotalPages(data.totalPages);
        } catch {

        }
    }

    const handleConfirm = async () => {
        if (!modal) return;

        const { userId, action } = modal;

        if (action === "deactivate") {
            await deactivateUser(userId);
        }

        if (action === "activate") {
            await activateUser(userId);
        }

        if (action === "delete") {
            await deleteUser(userId);
        }

        await loadUsers();
        setModal(null);
    }

    const handleNextPage = async () => {
        if ((pageNumber+1) < totalPages) setPageNumber(pageNumber+1);
    }

    const handlePrevPage = async () => {
        if (pageNumber > 0) setPageNumber(pageNumber-1);
    }

    useEffect(() => {
        loadUsers();
    }, [search, pageSize, pageNumber]);

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Manage Users</h1>
            <p className="text-gray-800 mb-4">
                Users total count: {usersCount}
            </p>
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Search"
                    className="bg-white rounded-2xl shadow-sm border-solid p-2 pl-4 mt-2 mb-3 w-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {users.map( (user) => (
                    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col hover:shadow-lg transition-shadow" key={user.id}>
                        <h3 className="text-lg font-semibold mb-1">{user.userName}</h3>
                        <p className="text-gray-900 text-mb">{user.email}</p>
                        <p className="text-gray-600 text-mb">{user.roles}</p>
                        <p className="text-gray-600 text-sm">{user.phoneNumber}</p>
                        <p className="text-gray-600 text-sm">{user.socialNetwork}</p>
                        {user.country
                        ? user.city
                            ? <p className="text-gray-600 text-sm">{user.country}, {user.city}</p>
                            : <p className="text-gray-600 text-sm">{user.country}</p>
                        : ""}
                        <p className="text-gray-600 text-sm">ID: {user.id}</p>
                        <p className="text-gray-600 text-sm">{user.isDeactivated ? "Deactivated due" : "Not deactivated"}</p>
                        <p className="text-gray-600 text-sm mb-1">{user.isDeactivated ? new Date(user.lockoutEnd).toLocaleString() : ""}</p>
                        <div className="mt-auto">
                            {user.isDeactivated
                                ? <Button className="mt-1" size="sm" variant="secondary" fullWidth={true} onClick={() => setModal({ userId: user.id, action: "activate" })}>Activate</Button>
                                : <Button className="mt-1" size="sm" variant="secondary" fullWidth={true} onClick={() => setModal({ userId: user.id, action: "deactivate" })}>Deactivate</Button>
                            }
                            <Button className="mt-1.5" size="sm" variant="danger" fullWidth={true} onClick={() => setModal({ userId: user.id, action: "delete" })}>Delete</Button>
                        </div>
                        
                    </div>
                ))}            
            </div>
            <Pagination
                prevPage={handlePrevPage}
                nextPage={handleNextPage}
                currentPage={pageNumber + 1}
                onChangeTotalPages={setPageSize}
            />

            {modal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-96">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                            {modal.action === "deactivate" && "Deactivate user"}
                            {modal.action === "activate" && "Activate user"}
                            {modal.action === "delete" && "Delete user"}
                        </h2>
                        <p className="text-gray-900 text-lg">Are you sure you want to {modal.action} this user?</p>
                        <p className="text-gray-900 text-lg">{modal.action === "delete" ? "This action is irreversible." : ""}</p>
                        <div className="flex justify-end gap-3 mt-5">
                            <Button
                                variant="secondary"
                                fullWidth={true}
                                onClick={() => setModal(null)}
                            >Cancel</Button>
                            <Button
                            variant="dangerExtra"
                                fullWidth={true}
                                onClick={() => handleConfirm()}
                            >Confirm</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};