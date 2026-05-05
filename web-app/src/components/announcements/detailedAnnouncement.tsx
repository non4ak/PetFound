import { Button } from "../ui/Button";
import { Comment } from "../ui/Comment";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface DetailedAnnouncementProps {
    selectedAnnouncement: any;
    comments: any[] | null;
    cancel: () => void;
    showIds: boolean;
    handleArchive: (id: number) => void;
    handleRestore: (id: number) => void;
}

export const DetailedAnnouncement = ({ selectedAnnouncement, comments, cancel, showIds, handleArchive, handleRestore }: DetailedAnnouncementProps) => {
    return (
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
                        }
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
                <Button variant="secondary" onClick={cancel} className="mt-3">
                    Close
                </Button>
            </div>
        </div>
    )
}