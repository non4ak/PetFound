import { Button } from "@/components/ui/Button";
import { getAnnouncements, getAnnouncementById } from "@/data/queries/announcements";
import type { AnnouncementDto, FullAnnouncementDto } from "@/types/announcements";
import { useEffect, useState } from "react";

export const Announcements = () => {
    const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
    const [showIds, setShowIds] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<FullAnnouncementDto | null>(null);

    const loadAnnouncementById = async (id: number) => {
        try {
            const data = await getAnnouncementById(id);
            setSelectedAnnouncement(data);
        } catch {
    
        }
    }

    useEffect(() => {
        const fetchAnnouncements = async () => {
            const data = await getAnnouncements();
            setAnnouncements(data.items);
        };

        fetchAnnouncements();
    }, []);

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Announcements</h1>
            <p className="text-gray-900">
                Manage your announcements here.
            </p>
            <div className="mb-4 mt-2 inline-flex items-center gap-4">
                <p className="text-gray-600 mb-1">
                    Toggle the visibility of IDs:
                </p>
                <Button variant="toggle" isActive={showIds} onClick={() => setShowIds(!showIds)}>
                    Toggle ID's
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {announcements.map((announcement) => (
                    <div
                        className="bg-white rounded-2xl shadow-sm p-4 flex flex-col hover:shadow-lg transition-shadow"
                        key={announcement.id}
                        onClick={() => loadAnnouncementById(announcement.id)}
                    >
                        <h3 className="text-lg font-semibold text-red-700 mb-1">{announcement.petStatusLabel}</h3>
                        <p className="text-gray-900 text-mb">{announcement.petTypeLabel}</p>
                        <p className="text-gray-600 text-sm">Reporter:</p>
                        <p className="text-gray-900 text-mb">{announcement.reporterUserName}</p>
                        <p className="text-gray-900 text-mb">{announcement.reporterEmail}</p>
                        <p className="text-gray-900 text-mb">{
                            announcement.country && announcement.city
                            ? `${announcement.country}, ${announcement.city}`
                            : announcement.country || announcement.city || ""    
                            }</p>
                        {announcement.isActive ? <p className="text-green-600 text-mb">Active</p> : <p className="text-red-600 text-mb">Inactive</p>}
                        <p className="text-gray-600 text-sm">Created on: {new Date(announcement.createdOn).toLocaleDateString()}</p>
                        {showIds && <p className="text-gray-600 text-sm mt-1">Announcement ID: {announcement.id}</p>}
                        {showIds && <p className="text-gray-600 text-sm">Pet ID: {announcement.petId}</p>}
                        {showIds && <p className="text-gray-600 text-sm">Reporter ID: {announcement.reporterUserId}</p>}
                    </div>
                ))}

                                <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col hover:shadow-lg transition-shadow">
                                    <h3 className="text-lg font-semibold mb-1">TEST</h3>
                                    <p className="text-gray-900 text-mb">TEST</p>
                                    <p className="text-gray-600 text-mb">Roles</p>
                                    <p className="text-gray-600 text-sm">Phone</p>
                                    <p className="text-gray-600 text-sm">Social Network</p>
                                    <p className="text-gray-600 text-sm">ID: ID</p>
                                    <p className="text-gray-600 text-sm">deactivated</p>
                                    <p className="text-gray-600 text-sm mb-1">aaa</p>
                                    <div className="mt-auto">
                                        
                                        <Button className="mt-1.5" size="sm" variant="danger" fullWidth={true} >Delete</Button>
                                    </div>
                                    
                                </div>
                                     
            </div>
            {selectedAnnouncement && (
                <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-2">Announcement Details</h2>
                    <p className="text-gray-900 text-lg font-semibold">Pet details</p>
                    <p className="text-gray-900">Status: {selectedAnnouncement.petStatusLabel}</p>
                    <p className="text-gray-900">Name: {selectedAnnouncement.pet.petName}</p>
                    <p className="text-gray-900">Type: {selectedAnnouncement.pet.petTypeLabel}</p>
                    <p className="text-gray-900">Breed: {selectedAnnouncement.pet.breed}</p>
                    <p className="text-gray-900">Sex: {selectedAnnouncement.pet.petSexLabel}</p>
                    <p className="text-gray-900">Size: {selectedAnnouncement.pet.petSizeLabel}</p>
                    <p className="text-gray-900">Age: {selectedAnnouncement.pet.petAgeCategoryLabel}</p>
                    <p className="text-gray-900">Chip number: {selectedAnnouncement.pet.chipNumber}</p>
                    <Button variant="secondary" onClick={() => setSelectedAnnouncement(null)}>Close</Button>
                </div>
            )}
        </div>
    );
};