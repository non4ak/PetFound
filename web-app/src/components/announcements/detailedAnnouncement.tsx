import { Button } from "../ui/Button";
import { Comment } from "../ui/Comment";
import { ConfirmModal } from "../ui/ConfirmModal";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
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
    handleEdit: (id: number, petStatus: number, city: string, country: string, petDetails: string, lastDateWhenSeen: string, approximateTime: string, isPhonePublic: boolean, isTelegramActive: boolean, nearLandmark: string, latitude: number, longitude: number) => void;
}

export const DetailedAnnouncement = ({ selectedAnnouncement, comments, cancel, showIds, handleArchive, handleRestore, handleEdit }: DetailedAnnouncementProps) => {
    const [editMode, setEditMode] = useState(false);
    const [action, setAction] = useState<string | null>(null);

    const countryRef = useRef<HTMLInputElement>(selectedAnnouncement.country);
    const cityRef = useRef<HTMLInputElement>(selectedAnnouncement.city);
    const lastDateWhenSeenRef = useRef<HTMLInputElement>(selectedAnnouncement.lastDateWhenSeen);
    const approximateTimeRef = useRef<HTMLInputElement>(selectedAnnouncement.approximateTime);
    const petDetailsRef = useRef<HTMLInputElement>(selectedAnnouncement.petDetails);
    const nearLandmarkRef = useRef<HTMLInputElement>(selectedAnnouncement.nearLandmark);
    const lastSeenLatitudeRef = useRef<HTMLInputElement>(selectedAnnouncement.lastSeenLatitude);
    const lastSeenLongitudeRef = useRef<HTMLInputElement>(selectedAnnouncement.lastSeenLongitude);
    const petStatusRef = useRef<HTMLInputElement>(selectedAnnouncement.petStatus);

    const [isPhonePublic, setIsPhonePublic] = useState(selectedAnnouncement.isPhonePublic);
    const [isTelegramActive, setIsTelegramActive] = useState(selectedAnnouncement.isTelegramActive);

    const handleSave = () => {
        handleEdit(selectedAnnouncement.id, parseInt(petStatusRef.current?.value), cityRef.current?.value, countryRef.current?.value, petDetailsRef.current?.value, lastDateWhenSeenRef.current?.value, approximateTimeRef.current?.value, isPhonePublic, isTelegramActive, nearLandmarkRef.current?.value, parseFloat(lastSeenLatitudeRef.current?.value), parseFloat(lastSeenLongitudeRef.current?.value));
        setEditMode(false);
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col hover:shadow-lg transition-shadow w-11/12 md:w-3/4 lg:w-1/2 xl:w-3/5 max-h-[95vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-2">Announcement Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                        {selectedAnnouncement.pet.petPhotoUrl && (
                            <img src={selectedAnnouncement.pet.petPhotoUrl} alt="Pet" className="rounded-lg shadow-md max-h-[300px] object-cover" width="full" />
                        )}
                        <p className="text-gray-900">Status: {
                            editMode ? (
                                <input
                                    type="text"
                                    placeholder="0 - Lost, 1 - Found"
                                    defaultValue={selectedAnnouncement.petStatus}
                                    className="bg-white rounded-2xl shadow-sm border-solid pl-4 m-1
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    ref = {petStatusRef}
                                />
                            ) : (
                                selectedAnnouncement.petStatusLabel
                            )
                        } 
                            <span className="text-gray-600">
                                {showIds && !editMode && ` | ${selectedAnnouncement.petStatus}`}
                            </span>
                        </p>
                        <p className="text-gray-900">Date: {
                            editMode ? (
                                <input
                                    type="text"
                                    placeholder="Last date when seen"
                                    defaultValue={selectedAnnouncement.lastDateWhenSeen}
                                    className="bg-white rounded-2xl shadow-sm border-solid pl-4 m-1
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    ref = {lastDateWhenSeenRef}
                                />
                            ) : (
                                new Date(selectedAnnouncement.lastDateWhenSeen).toLocaleDateString()
                            )
                        }</p>
                        <p className="text-gray-900">Time: {
                            editMode ? (
                                <input
                                    type="text"
                                    placeholder="Approximate time"
                                    defaultValue={selectedAnnouncement.approximateTime}
                                    className="bg-white rounded-2xl shadow-sm border-solid pl-4 m-1
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    ref = {approximateTimeRef}
                                />
                            ) : (
                                selectedAnnouncement.approximateTime
                            )
                        }</p>
                        <p className="text-gray-900">Details: {
                            editMode ? (
                                <input
                                    type="text"
                                    placeholder="Pet details"
                                    defaultValue={selectedAnnouncement.petDetails}
                                    className="bg-white rounded-2xl shadow-sm border-solid pl-4 m-1
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    ref = {petDetailsRef}
                                />
                            ) : (
                                selectedAnnouncement.petDetails
                            )
                        }</p>
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
                        <p className="text-gray-900">Phone public: 
                            {editMode ? (
                                <Button 
                                    variant="toggle" 
                                    isActive={isPhonePublic} 
                                    onClick={() => {setIsPhonePublic(!isPhonePublic)}}
                                    className="ml-2"
                                >
                                    Phone publicity
                                </Button>
                            ) : (
                                selectedAnnouncement.isPhonePublic ? ' Yes' : ' No'
                            )}
                        </p>
                        <p className="text-gray-900">Telegram active: 
                            {editMode ? (
                                <Button 
                                    variant="toggle" 
                                    isActive={isTelegramActive} 
                                    onClick={() => {setIsTelegramActive(!isTelegramActive)}}
                                    className="ml-2"
                                >
                                    Telegram activity
                                </Button>
                            ) : (
                                selectedAnnouncement.isTelegramActive ? ' Yes' : ' No'
                            )}
                        </p>
                        {showIds && <p className="text-gray-600 text-sm mt-1">Reporter ID: {selectedAnnouncement.reporterUserId}</p>}
        
                        <p className="text-gray-900 text-lg font-semibold mt-2 mb-1">Location</p>
                        {editMode ? 
                            (
                                <div>
                                    <p className="text-gray-900">City: 
                                        <input
                                            type="text"
                                            placeholder="Pet details"
                                            defaultValue={selectedAnnouncement.city}
                                            className="bg-white rounded-2xl shadow-sm border-solid pl-4 m-1
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            ref = {cityRef}
                                        />
                                    </p>
                                    <p className="text-gray-900">Country: 
                                        <input
                                            type="text"
                                            placeholder="Pet details"
                                            defaultValue={selectedAnnouncement.country}
                                            className="bg-white rounded-2xl shadow-sm border-solid pl-4 m-1
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            ref = {countryRef}
                                        />
                                    </p>
                                </div>
                            ) : 
                            (<p className="text-gray-900">{selectedAnnouncement.city}, {selectedAnnouncement.country}</p>)
                        }
                        <p className="text-gray-900">Near: {
                            editMode ? (
                                <input
                                    type="text"
                                    placeholder="Near landmark"
                                    defaultValue={selectedAnnouncement.nearLandmark}
                                    className="bg-white rounded-2xl shadow-sm border-solid pl-4 m-1
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    ref = {nearLandmarkRef}
                                />
                            ) : (
                                selectedAnnouncement.nearLandmark
                            )
                        }</p>
                        <p className="text-gray-900">Latitude: {
                            editMode ? (
                                <input
                                    type="text"
                                    placeholder="Latitude"
                                    defaultValue={selectedAnnouncement.lastSeenLatitude}
                                    className="bg-white rounded-2xl shadow-sm border-solid pl-4 m-1
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    ref = {lastSeenLatitudeRef}
                                />
                            ) : (
                                selectedAnnouncement.lastSeenLatitude
                            )
                        }</p>
                        <p className="text-gray-900">Longtitude: {
                            editMode ? (
                                <input
                                    type="text"
                                    placeholder="Longitude"
                                    defaultValue={selectedAnnouncement.lastSeenLongitude}
                                    className="bg-white rounded-2xl shadow-sm border-solid pl-4 m-1
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    ref = {lastSeenLongitudeRef}
                                />
                            ) : (
                                selectedAnnouncement.lastSeenLongitude
                            )
                        }</p>
                        <div className="mt-1">
                            <MapContainer 
                                center={[selectedAnnouncement.lastSeenLatitude, selectedAnnouncement.lastSeenLongitude]} 
                                zoom={17} 
                                style={{ minHeight: "300px", width: "100%", borderRadius: "0.5rem", marginBottom: "1rem", zIndex: 60 }}
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
                            ( <Button variant="danger" className="mb-2" onClick={() => setAction("archive")}>Archive</Button> ) :
                            ( <Button variant="danger" className="mb-2" onClick={() => setAction("restore")}>Restore</Button> )
                        }
                        {editMode ? 
                            ( <div className="grid grid-cols-2 gap-2">
                                <Button variant="secondary" className="mb-3" fullWidth={true} onClick={() => setAction("cancelEdit")}>Cancel</Button>
                                <Button variant="danger" className="mb-3" fullWidth={true} onClick={() => setAction("saveEdit")}>Save</Button>
                            </div> ) :
                            ( <Button variant="edit" className="mb-3" onClick={() => setEditMode(true)}>Edit</Button> )
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
                <Button variant="secondary" onClick={() => cancel()} className="mt-3">
                    Close
                </Button>
            </div>
            {action === "saveEdit" && (
                <ConfirmModal
                    title="Confirm Edit"
                    message="Are you sure you want to save the changes to this announcement?"
                    onConfirm={() => {handleSave(); setAction(null);}}
                    onCancel={() => setAction(null)}
                />
            )}
            {action === "cancelEdit" && (
                <ConfirmModal
                    title="Are you sure?"
                    message="You want to discard the changes to this announcement?"
                    onConfirm={() => {setEditMode(false); setAction(null);}}
                    onCancel={() => setAction(null)}
                />
            )}
            {action === "archive" && (
                <ConfirmModal
                    title="Confirm archiving"
                    message="Are you sure you want to archive this announcement?"
                    onConfirm={() => {setEditMode(false); setAction(null); handleArchive(selectedAnnouncement.id);}}
                    onCancel={() => setAction(null)}
                />
            )}
            {action === "restore" && (
                <ConfirmModal
                    title="Confirm restoration"
                    message="Are you sure you want to restore this announcement?"
                    onConfirm={() => {setEditMode(false); setAction(null); handleRestore(selectedAnnouncement.id);}}
                    onCancel={() => setAction(null)}
                />
            )}
        </div>
    )
}