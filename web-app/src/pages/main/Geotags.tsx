import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
    getGeotags,
    getGeotagById,
    createGeotag,
    updateGeotag,
    deleteGeotag,
} from "@/data/queries/geotags";
import type { GeotagDto, CreateGeotagDto } from "@/types/geotags";
import { DetailedGeotag, CATEGORY_LABELS, CATEGORY_COLORS } from "@/components/geotags/DetailedGeotag";

const emptyForm: CreateGeotagDto = {
    title: "",
    description: "",
    category: 0,
    latitude: null,
    longitude: null,
    address: "",
    photoUrl: null,
};

export const Geotags = () => {
    const [geotags, setGeotags] = useState<GeotagDto[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(0);

    // filters
    const [searchFilter, setSearchFilter] = useState<string>("");
    const [categoryFilter, setCategoryFilter] = useState<number | undefined>(undefined);

    // modal states
    const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
    const [formData, setFormData] = useState<CreateGeotagDto>(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateGeotagDto, string>>>({});

    const [deleteModal, setDeleteModal] = useState<{ id: number; title: string } | null>(null);
    const [viewGeotag, setViewGeotag] = useState<GeotagDto | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadGeotags = async () => {
        try {
            setError(null);
            const data = await getGeotags({
                search: searchFilter || undefined,
                category: categoryFilter,
                pageNumber,
                pageSize,
            });
            setGeotags(data.items);
            setTotalCount(data.totalCount);
            setTotalPages(data.totalPages);
        } catch {
            setError("Failed to load geotags. Please try again.");
        }
    };

    useEffect(() => {
        void loadGeotags();
    }, [searchFilter, categoryFilter, pageNumber, pageSize]);

    const handleNextPage = () => {
        if (pageNumber + 1 < totalPages) setPageNumber(pageNumber + 1);
    };

    const handlePrevPage = () => {
        if (pageNumber > 0) setPageNumber(pageNumber - 1);
    };

    const openCreateForm = () => {
        setFormData(emptyForm);
        setFormErrors({});
        setEditingId(null);
        setFormMode("create");
    };

    const openEditForm = async (id: number) => {
        try {
            const geotag = await getGeotagById(id);
            setFormData({
                title: geotag.title,
                description: geotag.description,
                category: geotag.category,
                latitude: geotag.latitude,
                longitude: geotag.longitude,
                address: geotag.address,
                photoUrl: geotag.photoUrl ?? null,
            });
            setFormErrors({});
            setEditingId(id);
            setFormMode("edit");
        } catch {
            setError("Failed to load geotag details.");
        }
    };

    const openViewModal = async (id: number) => {
        try {
            const geotag = await getGeotagById(id);
            setViewGeotag(geotag);
        } catch {
            setError("Failed to load geotag details.");
        }
    };

    const validateForm = (): boolean => {
        const errors: Partial<Record<keyof CreateGeotagDto, string>> = {};
        if (!formData.title.trim()) errors.title = "Title is required";
        if (!formData.address.trim()) errors.address = "Address is required";
        if (formData.latitude !== null && (formData.latitude < -90 || formData.latitude > 90))
            errors.latitude = "Latitude must be between -90 and 90";
        if (formData.longitude !== null && (formData.longitude < -180 || formData.longitude > 180))
            errors.longitude = "Longitude must be between -180 and 180";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            if (formMode === "create") {
                await createGeotag(formData);
            } else if (formMode === "edit" && editingId !== null) {
                await updateGeotag(editingId, formData);
            }
            setFormMode(null);
            await loadGeotags();
        } catch {
            setError("Failed to save geotag. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal) return;
        try {
            await deleteGeotag(deleteModal.id);
            setDeleteModal(null);
            await loadGeotags();
        } catch {
            setError("Failed to delete geotag.");
            setDeleteModal(null);
        }
    };

    const updateField = <K extends keyof CreateGeotagDto>(key: K, value: CreateGeotagDto[K]) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        if (formErrors[key]) setFormErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Geotags (POI)</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Manage points of interest on the map — shelters, vet clinics, parks, and more.
                    </p>
                </div>
                <Button variant="primary" onClick={openCreateForm}>
                    + New Geotag
                </Button>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
                    {error}
                    <button
                        className="ml-3 text-red-400 hover:text-red-600 font-bold"
                        onClick={() => setError(null)}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5 mt-4">
                <input
                    type="text"
                    placeholder="Search by title or address..."
                    value={searchFilter}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 pl-4 w-64
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    onChange={(e) => {
                        setSearchFilter(e.target.value);
                        setPageNumber(0);
                    }}
                />
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-600">Category:</span>
                    <Button
                        size="sm"
                        variant={categoryFilter === undefined ? "primary" : "secondary"}
                        onClick={() => { setCategoryFilter(undefined); setPageNumber(0); }}
                    >
                        All
                    </Button>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <Button
                            key={key}
                            size="sm"
                            variant={categoryFilter === Number(key) ? "primary" : "secondary"}
                            onClick={() => { setCategoryFilter(Number(key)); setPageNumber(0); }}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
            </div>

            <p className="text-gray-500 text-sm mb-4">
                Total: <span className="font-semibold text-gray-800">{totalCount}</span> geotags
            </p>

            {/* Grid */}
            {geotags.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-lg font-medium">No geotags found</p>
                    <p className="text-sm mt-1">Try changing your filters or create a new one.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {geotags.map((geotag) => (
                        <div
                            key={geotag.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition-shadow cursor-pointer group"
                            onClick={() => void openViewModal(geotag.id)}
                        >
                            {geotag.photoUrl && (
                                <img
                                    src={geotag.photoUrl}
                                    alt={geotag.title}
                                    className="w-full h-32 object-cover rounded-xl mb-1"
                                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                />
                            )}
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                                    {geotag.title}
                                </h3>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap flex-shrink-0 ${CATEGORY_COLORS[geotag.category] ?? "bg-gray-100 text-gray-600"}`}
                                >
                                    {geotag.categoryLabel}
                                </span>
                            </div>
                            {geotag.description && (
                                <p className="text-gray-500 text-xs line-clamp-2">{geotag.description}</p>
                            )}
                            <p className="text-gray-400 text-xs">{geotag.address}</p>
                            {geotag.latitude !== null && geotag.longitude !== null ? (
                                <p className="text-gray-400 text-xs">
                                    {geotag.latitude.toFixed(5)}, {geotag.longitude.toFixed(5)}
                                </p>
                            ) : (
                                <p className="text-gray-400 text-xs italic">No coordinates</p>
                            )}
                            {/* Actions */}
                            <div
                                className="flex gap-2 mt-auto pt-2 border-t border-gray-100"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Button
                                    size="sm"
                                    variant="edit"
                                    className="flex-1"
                                    onClick={() => void openEditForm(geotag.id)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="dangerExtra"
                                    onClick={() => setDeleteModal({ id: geotag.id, title: geotag.title })}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Pagination
                prevPage={handlePrevPage}
                nextPage={handleNextPage}
                currentPage={pageNumber + 1}
                onChangeTotalPages={setPageSize}
            />

            {/* ─── View Modal ─── */}
            {viewGeotag && (
                <DetailedGeotag
                    geotag={viewGeotag}
                    onClose={() => setViewGeotag(null)}
                    onEdit={(id) => void openEditForm(id)}
                    onDelete={(id, title) => setDeleteModal({ id, title })}
                />
            )}

            {/* ─── Create / Edit Form Modal ─── */}
            {formMode !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                    onClick={() => setFormMode(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
                            onClick={() => setFormMode(null)}
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 mb-5">
                            {formMode === "create" ? "Create Geotag" : "Edit Geotag"}
                        </h2>

                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => updateField("title", e.target.value)}
                                    placeholder="Enter title"
                                    className={`w-full rounded-xl border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.title ? "border-red-400" : "border-gray-300"}`}
                                />
                                {formErrors.title && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => updateField("description", e.target.value)}
                                    placeholder="Enter description"
                                    rows={3}
                                    className="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => updateField("category", Number(e.target.value))}
                                    className="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Latitude & Longitude */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Latitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.latitude ?? ""}
                                        onChange={(e) => updateField("latitude", e.target.value === "" ? null : Number(e.target.value))}
                                        placeholder="e.g. 50.4501"
                                        className={`w-full rounded-xl border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.latitude ? "border-red-400" : "border-gray-300"}`}
                                    />
                                    {formErrors.latitude && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.latitude}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Longitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.longitude ?? ""}
                                        onChange={(e) => updateField("longitude", e.target.value === "" ? null : Number(e.target.value))}
                                        placeholder="e.g. 30.5234"
                                        className={`w-full rounded-xl border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.longitude ? "border-red-400" : "border-gray-300"}`}
                                    />
                                    {formErrors.longitude && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.longitude}</p>
                                    )}
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => updateField("address", e.target.value)}
                                    placeholder="Enter address"
                                    className={`w-full rounded-xl border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.address ? "border-red-400" : "border-gray-300"}`}
                                />
                                {formErrors.address && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                                )}
                            </div>

                            {/* Photo URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Photo URL
                                </label>
                                <input
                                    type="text"
                                    value={formData.photoUrl ?? ""}
                                    onChange={(e) => updateField("photoUrl", e.target.value || null)}
                                    placeholder="https://..."
                                    className="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {formData.photoUrl && (
                                    <img
                                        src={formData.photoUrl}
                                        alt="Preview"
                                        className="mt-2 h-24 w-auto rounded-lg object-cover border border-gray-200"
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button
                                variant="primary"
                                className="flex-1"
                                isLoading={isSubmitting}
                                onClick={() => void handleSubmit()}
                            >
                                {formMode === "create" ? "Create" : "Save Changes"}
                            </Button>
                            <Button variant="secondary" onClick={() => setFormMode(null)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteModal && (
                <ConfirmModal
                    title="Delete Geotag"
                    message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
                    onConfirm={() => void handleDeleteConfirm()}
                    onCancel={() => setDeleteModal(null)}
                />
            )}
        </div>
    );
};