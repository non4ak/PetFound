import { Button } from "@/components/ui/Button";
import { Comment } from "@/components/ui/Comment";
import { Pagination } from "@/components/ui/Pagination";
import { getAnnouncements, getAnnouncementById, archiveAnnouncement, restoreAnnouncement } from "@/data/queries/announcements";
import type { AnnouncementDto, FullAnnouncementDto } from "@/types/announcements";
import { getCommentsByAnnouncementId } from "@/data/queries/comments";
import type { CommentDto } from "@/types/comments";
import { DetailedAnnouncement } from "@/components/announcements/detailedAnnouncement";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { set } from "zod";

export const Announcements = () => {
    const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
    const [totalAnnouncements, setTotalAnnouncements] = useState(0);
    const [showIds, setShowIds] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<FullAnnouncementDto | null>(null);
    const [comments, setComments] = useState<CommentDto[] | null>([]);
    const [petTypeFilter, setPetTypeFilter] = useState<number | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
    const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);
    const [cityFilter, setCityFilter] = useState<string | undefined>(undefined);
    const [countryFilter, setCountryFilter] = useState<string | undefined>(undefined);
    const [searchId, setSearchId] = useState<number>(0);

    const [pageSize, setPageSize] = useState(20);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    
    const handleNextPage = async () => {
        if ((pageNumber+1) < totalPages) setPageNumber(pageNumber+1);
    }

    const handlePrevPage = async () => {
        if (pageNumber > 0) setPageNumber(pageNumber-1);
    }

    const loadAnnouncementById = async (id: number) => {
        try {
            const data = await getAnnouncementById(id);
            setSelectedAnnouncement(data);
            const commentsData = await getCommentsByAnnouncementId(id);
            setComments(commentsData.items);
        } catch {
    
        }
    }

    const handleCancelDetails = () => {
        setSelectedAnnouncement(null);
        setComments(null);
    }

    const handleArchive = async (id: number) => {
        await archiveAnnouncement(id);
        handleCancelDetails();
    }

    const handleRestore = async (id: number) => {
        await restoreAnnouncement(id);
        handleCancelDetails();
    }

    useEffect(() => {
        const fetchAnnouncements = async () => {
            const data = await getAnnouncements(petTypeFilter, statusFilter, isActiveFilter, cityFilter, countryFilter, pageNumber, pageSize ? pageSize : 20);
            setAnnouncements(data.items);
            setTotalAnnouncements(data.totalCount);
            setTotalPages(data.totalPages);
        };

        fetchAnnouncements();
    }, [selectedAnnouncement, petTypeFilter, statusFilter, isActiveFilter, cityFilter, countryFilter, pageNumber, pageSize]);

    return ( 
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex-col">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Announcements</h1>
                <p className="text-gray-900 mb-1    ">
                    Here you can view and manage all the announcements. 
                    Click on an announcement to see more details, comments, and to archive or restore it. 
                    Use the filters to narrow down the list of announcements based on pet type, status, activity, and location. 
                    You can also search for a specific announcement by its ID.
                </p>
                <p className="text-gray-600">
                    Total number of announcements by set parameters: {totalAnnouncements}
                </p>
                <div className="mb-1 mt-2 inline-flex items-center gap-4">
                    <p className="text-gray-900 mb-1">
                        Search by announcement ID:
                    </p>
                    <input
                        type="text"
                        placeholder="ID"
                        className="bg-white rounded-2xl shadow-sm border-solid p-2 pl-4 mt-2 mb-3
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setSearchId(Number(e.target.value))}
                    />
                    <Button variant="primary" onClick={() => loadAnnouncementById(searchId)}>Search</Button>
                </div>
                <br />
                <div className="mb-10 inline-flex items-center gap-4">
                    <p className="text-gray-600 mb-1">
                        Toggle the visibility of IDs:
                    </p>
                    <Button variant="toggle" isActive={showIds} onClick={() => setShowIds(!showIds)} className="opacity-50">
                        Toggle ID's
                    </Button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-[1fr_1fr_1.5fr_1fr] gap-4 mb-4">
                <div className="flex flex-col items-center gap-2 border-r-1 border-gray-300 pr-4">
                    <p className="text-gray-900 text-mb">Status</p>
                    <div className="flex gap-2">
                        <Button variant={statusFilter === undefined ? "primary" : "secondary"} onClick={() => setStatusFilter(undefined)}>
                            All
                        </Button>
                        <Button variant={statusFilter === 0 ? "primary" : "secondary"} onClick={() => setStatusFilter(0)}>
                            Lost
                        </Button>
                        <Button variant={statusFilter === 1 ? "primary" : "secondary"} onClick={() => setStatusFilter(1)}>
                            Found
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 border-r-1 border-gray-300 pr-4">
                    <p className="text-gray-900 text-mb">Pet Type</p>
                    <div className="flex gap-2">
                        <Button variant={petTypeFilter === undefined ? "primary" : "secondary"} onClick={() => setPetTypeFilter(undefined)}>
                            All
                        </Button>
                        <Button variant={petTypeFilter === 0 ? "primary" : "secondary"} onClick={() => setPetTypeFilter(0)}>
                            Cats
                        </Button>
                        <Button variant={petTypeFilter === 1 ? "primary" : "secondary"} onClick={() => setPetTypeFilter(1)}>
                            Dogs
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 border-r-1 border-gray-300 pr-4">
                    <p className="text-gray-900 text-mb">Is Active</p>
                    <div className="flex gap-2">
                        <Button variant={isActiveFilter === undefined ? "primary" : "secondary"} onClick={() => setIsActiveFilter(undefined)}>
                            All
                        </Button>
                        <Button variant={isActiveFilter === true ? "primary" : "secondary"} onClick={() => setIsActiveFilter(true)}>
                            Active
                        </Button>
                        <Button variant={isActiveFilter === false ? "primary" : "secondary"} onClick={() => setIsActiveFilter(false)}>
                            Archived
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 pr-4">
                    <p className="text-gray-900 text-mb">Location</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Country"
                            className="bg-white rounded-2xl shadow-sm border-solid p-2 pl-4 mb-3
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setCountryFilter(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="City"
                            className="bg-white rounded-2xl shadow-sm border-solid p-2 pl-4 mb-3
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setCityFilter(e.target.value)}
                        />
                    </div>
                </div>

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
                        <p className="text-gray-900 text-mb">{
                            announcement.country && announcement.city
                            ? `${announcement.country}, ${announcement.city}`
                            : announcement.country || announcement.city || ""    
                        }</p>
                        {announcement.isActive ? <p className="text-green-600 text-mb">Active</p> : <p className="text-red-600 text-mb">Archived</p>}
                        <p className="text-gray-600 text-sm mt-1">Reporter:</p>
                        <p className="text-gray-900 text-mb">{announcement.reporterUserName}</p>
                        <p className="text-gray-900 text-mb">{announcement.reporterEmail}</p>
                        <p className="text-gray-600 text-sm">Created on: {new Date(announcement.createdOn).toLocaleDateString()}</p>
                        {showIds && <p className="text-gray-600 text-sm mt-1">Announcement ID: {announcement.id}</p>}
                        {showIds && <p className="text-gray-600 text-sm">Pet ID: {announcement.petId}</p>}
                        {showIds && <p className="text-gray-600 text-sm">Reporter ID: {announcement.reporterUserId}</p>}
                    </div>
                ))}
            </div>
            <Pagination
                prevPage={handlePrevPage}
                nextPage={handleNextPage}
                currentPage={pageNumber + 1}
                onChangeTotalPages={setPageSize}
            />
            {selectedAnnouncement && 
                <DetailedAnnouncement
                    selectedAnnouncement={selectedAnnouncement}
                    comments={comments}
                    cancel={handleCancelDetails}
                    showIds={showIds}
                    handleArchive={handleArchive}
                    handleRestore={handleRestore}
                />
            }
        </div>
    );
}