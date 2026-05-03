import { Button } from "@/components/ui/Button";
import { getAnnouncements, getAnnouncementById } from "@/data/queries/announcements";
import type { AnnouncementDto, FullAnnouncementDto } from "@/types/announcements";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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

    const LeafletMap = () => {
    const position: [number, number] = [55.75, 37.61]; // Координаты [lat, lng]
    };

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
                                     
            </div>
            {selectedAnnouncement && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col hover:shadow-lg transition-shadow w-11/12 md:w-3/4 lg:w-1/2 xl:w-2/5">
                        <h2 className="text-xl font-semibold mb-2">Announcement Details</h2>
                        <p className="text-gray-900 text-lg font-semibold">Pet details</p>
                        <p className="text-gray-900">
                            Status: {selectedAnnouncement.petStatusLabel}
                            <span className="text-gray-600">
                                {showIds && ` | ${selectedAnnouncement.petStatus}`}
                            </span>
                        </p>
                        <p className="text-gray-900">Name: {selectedAnnouncement.pet.petName}</p>
                        <p className="text-gray-900">
                            Type: {selectedAnnouncement.pet.petTypeLabel}
                            <span className="text-gray-600">
                                {showIds && ` | ${selectedAnnouncement.pet.petType}`}
                            </span>
                        </p>
                        <p className="text-gray-900">Breed: {selectedAnnouncement.pet.breed}</p>
                        <p className="text-gray-900">
                            Sex: {selectedAnnouncement.pet.petSexLabel}
                            <span className="text-gray-600">
                                {showIds && ` | ${selectedAnnouncement.pet.petSex}`}
                            </span>
                        </p>
                        <p className="text-gray-900">
                            Size: {selectedAnnouncement.pet.petSizeLabel}
                            <span className="text-gray-600">
                                {showIds && ` | ${selectedAnnouncement.pet.petSize}`}
                            </span>
                        </p>
                        <p className="text-gray-900">
                            Age: {selectedAnnouncement.pet.petAgeCategoryLabel}
                            <span className="text-gray-600">
                                {showIds && ` | ${selectedAnnouncement.pet.petAgeCategory}`}
                            </span>
                        </p>
                        <p className="text-gray-900">Chip number: {selectedAnnouncement.pet.chipNumber}</p>
                        

                        <MapContainer 
                            center={[selectedAnnouncement.lastSeenLatitude, selectedAnnouncement.lastSeenLongitude]} 
                            zoom={17} 
                            style={{ height: "500px", width: "100%", borderRadius: "0.5rem", marginTop: "1rem", marginBottom: "1rem" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            
                            <Marker position={[selectedAnnouncement.lastSeenLatitude, selectedAnnouncement.lastSeenLongitude]}>
                                <Popup>
                                    Last seen location of the pet. <br></br> {selectedAnnouncement.nearLandmark && `Near: ${selectedAnnouncement.nearLandmark}`}
                                </Popup>
                            </Marker>
                        </MapContainer>


                        <Button variant="secondary" onClick={() => setSelectedAnnouncement(null)}>Close</Button>
                    </div>
                </div>
            )}
        </div>
    );
}