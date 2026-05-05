import { Button } from "@/components/ui/Button";
import { Comment } from "@/components/ui/Comment";
import { Pagination } from "@/components/ui/Pagination";
import { getAnnouncements, getAnnouncementById, archiveAnnouncement, restoreAnnouncement } from "@/data/queries/announcements";
import type { AnnouncementDto, FullAnnouncementDto } from "@/types/announcements";
import { getCommentsByAnnouncementId } from "@/data/queries/comments";
import type { CommentDto } from "@/types/comments";
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
  ***REMOVED***

    const handlePrevPage = async () => {
        if (pageNumber > 0) setPageNumber(pageNumber-1);
  ***REMOVED***

    const loadAnnouncementById = async (id: number) => {
        try {
            const data = await getAnnouncementById(id);
            setSelectedAnnouncement(data);
            const commentsData = await getCommentsByAnnouncementId(id);
            setComments(commentsData.items);
      ***REMOVED*** catch {
    
      ***REMOVED***
  ***REMOVED***

    const handleCancelDetails = () => {
        setSelectedAnnouncement(null);
        setComments(null);
  ***REMOVED***

    const handleArchive = async (id: number) => {
        await archiveAnnouncement(id);
        handleCancelDetails();
  ***REMOVED***

    const handleRestore = async (id: number) => {
        await restoreAnnouncement(id);
        handleCancelDetails();
  ***REMOVED***

    useEffect(() => {
        const fetchAnnouncements = async () => {
            const data = await getAnnouncements(petTypeFilter, statusFilter, isActiveFilter, cityFilter, countryFilter, pageNumber, pageSize ? pageSize : 20);
            setAnnouncements(data.items);
            setTotalAnnouncements(data.totalCount);
            setTotalPages(data.totalPages);
      ***REMOVED***;

        fetchAnnouncements();
  ***REMOVED***, [selectedAnnouncement, petTypeFilter, statusFilter, isActiveFilter, cityFilter, countryFilter, pageNumber, pageSize]);

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
                      ***REMOVED***</p>
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
            {selectedAnnouncement && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col hover:shadow-lg transition-shadow w-11/12 md:w-3/4 lg:w-1/2 xl:w-3/5 max-h-[95vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-2">Announcement Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col">
                                {selectedAnnouncement.pet.petPhotoUrl && (
                                    <img src={selectedAnnouncement.pet.petPhotoUrl} alt="Pet" className="rounded-lg shadow-md max-h-[300px] object-cover" width="full" />
                                )}
                                <p className="text-gray-900 mt-1">
                                    Status: {selectedAnnouncement.petStatusLabel}
                                    <span className="text-gray-600">
                                        {showIds && ` | ${selectedAnnouncement.petStatus}`}
                                    </span>
                                </p>
                                <p className="text-gray-900">Date: {new Date(selectedAnnouncement.lastDateWhenSeen).toLocaleDateString()}</p>
                                <p className="text-gray-900">Time: {selectedAnnouncement.approximateTime}</p>
                                <p className="text-gray-900">Details: {selectedAnnouncement.petDetails}</p>
                                <p className="text-gray-900 text-lg font-semibold mt-2">Pet details</p>
                                <div className="grid grid-cols-2">
                                    
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
                                    
                                </div>
                                <p className="text-gray-900 mt-1">Pet description: {selectedAnnouncement.pet.description}</p>
                                
                            </div>
                            <div className="flex flex-col border-l-1 border-gray-300 pl-5">
                                
                                <p className="text-gray-900 text-lg font-semibold">Reporter User Details</p>
                                <p className="text-gray-900">Username: {selectedAnnouncement.reporterUserName}</p>
                                <p className="text-gray-900">Email: {selectedAnnouncement.reporterEmail}</p>
                                <p className="text-gray-900">Phone public: {selectedAnnouncement.isPhonePublic ? 'Yes' : 'No'}</p>
                                <p className="text-gray-900">Telegram active: {selectedAnnouncement.isTelegramActive ? 'Yes' : 'No'}</p>
                                {showIds && <p className="text-gray-600 text-sm mt-1">Reporter ID: {selectedAnnouncement.reporterUserId}</p>}

                                <p className="text-gray-900 text-lg font-semibold mt-2 mb-1">Location</p>
                                <p className="text-gray-900">{selectedAnnouncement.city}, {selectedAnnouncement.country}</p>
                                <p className="text-gray-900">Near: {selectedAnnouncement.nearLandmark}</p>
                                <div className="mt-1">
                                    <MapContainer 
                                        center={[selectedAnnouncement.lastSeenLatitude, selectedAnnouncement.lastSeenLongitude]} 
                                        zoom={17} 
                                        style={{ minHeight: "300px", width: "100%", borderRadius: "0.5rem", marginBottom: "1rem" }}
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
                                </div>
                                {selectedAnnouncement.isActive ? 
                                    ( <Button variant="danger" className="mb-3" onClick={() => handleArchive(selectedAnnouncement.id)}>Archive</Button> ) :
                                    ( <Button variant="danger" className="mb-3" onClick={() => handleRestore(selectedAnnouncement.id)}>Restore</Button> )
                              ***REMOVED***
                            </div>
                        </div>
                        
                        {comments && comments?.length > 0 && (
                            <div className="mt-2">
                                <p className="text-gray-900 text-lg font-semibold mb-1">Comments</p>
                                {comments.map((comment) => (
                                    <Comment comment={comment} depth={0} showId={showIds} key={comment.id}/>
                                ))}
                            </div>
                        )}
                        <Button variant="secondary" onClick={handleCancelDetails} className="mt-3">
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}