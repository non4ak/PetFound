import { Button } from "@/components/ui/Button";
import type { GeotagDto } from "@/types/geotags";

export const CATEGORY_COLORS: Record<number, string> = {
    0: "bg-gray-100 text-gray-700",
    1: "bg-blue-100 text-blue-700",
    2: "bg-green-100 text-green-700",
    3: "bg-emerald-100 text-emerald-700",
    4: "bg-red-100 text-red-700",
    5: "bg-purple-100 text-purple-700",
};

export const CATEGORY_LABELS: Record<number, string> = {
    0: "General",
    1: "Shelter",
    2: "Vet Clinic",
    3: "Park",
    4: "Danger Zone",
    5: "Other",
};

interface DetailedGeotagProps {
    geotag: GeotagDto;
    onClose: () => void;
    onEdit: (id: number) => void;
    onDelete: (id: number, title: string) => void;
}

export const DetailedGeotag = ({ geotag, onClose, onEdit, onDelete }: DetailedGeotagProps) => {
    const categoryColor = CATEGORY_COLORS[geotag.category] ?? "bg-gray-100 text-gray-600";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
                    onClick={onClose}
                >
                    ✕
                </button>

                {geotag.photoUrl && (
                    <img
                        src={geotag.photoUrl}
                        alt={geotag.title}
                        className="w-full h-48 object-cover rounded-xl mb-4"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                    />
                )}

                <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-xl font-bold text-gray-900">{geotag.title}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor}`}>
                        {geotag.categoryLabel}
                    </span>
                </div>

                {geotag.description && (
                    <p className="text-gray-600 text-sm mb-3">{geotag.description}</p>
                )}

                <div className="space-y-1.5 text-sm text-gray-600">
                    <p>
                        📍 <span className="font-medium">{geotag.address}</span>
                    </p>
                    {geotag.latitude !== null && geotag.longitude !== null ? (
                        <p>
                            🌐 {geotag.latitude}, {geotag.longitude}
                        </p>
                    ) : (
                        <p className="text-gray-400 italic">No coordinates</p>
                    )}
                    <p className="text-gray-400 text-xs">
                        Created: {new Date(geotag.createdOn).toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-xs">ID: {geotag.id}</p>
                </div>

                <div className="flex gap-2 mt-5">
                    <Button
                        variant="edit"
                        className="flex-1"
                        onClick={() => {
                            onClose();
                            onEdit(geotag.id);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="dangerExtra"
                        onClick={() => {
                            onClose();
                            onDelete(geotag.id, geotag.title);
                        }}
                    >
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};