import { getAddressByCoords } from "@/data/queries/address";
import type { Address } from "@/types/address";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import type { deleteComment } from "@/data/queries/comments";

interface CommentProps {
    comment: any;
    depth?: number;
    author?: any;
    showId?: boolean;
    manageMode?: boolean;
    deleteComment?: (announcementId: number, commentId: number) => Promise<void>;
    editComment?: (announcementId: number, commentId: number, commentMessage: string, imageUrl: string | null, latitude: number | null, longitude: number | null, locationDescription: string | null) => Promise<void>;
}

export const Comment = ({ comment, depth = 0, author, showId = false, manageMode = false, deleteComment, editComment }: CommentProps) => {
    const [address, setAddress] = useState<Address | null>(null);

    const [editMode, setEditMode] = useState(false);
    const [editedMessage, setEditedMessage] = useState(comment.commentMessage);
    const [editedImageUrl, setEditedImageUrl] = useState(comment.imageUrl);
    const [editedLatitude, setEditedLatitude] = useState(comment.latitude);
    const [editedLongitude, setEditedLongitude] = useState(comment.longitude);
    const [editedLocationDescription, setEditedLocationDescription] = useState(comment.locationDescription);

    async function fetchAddress() {
        if (comment.latitude && comment.longitude) {
            const fetchedAddress = await getAddressByCoords(comment.latitude, comment.longitude);
            setAddress(fetchedAddress);
            console.log(`Fetched address for comment ${comment.id}: ${fetchedAddress.display_name}`); // Debug alert
        }
    }

    useEffect(() => {
        fetchAddress();
    }, []);

    return (
        <div className={`bg-white rounded-2xl shadow-sm pl-4 pb-2 pt-2 pr-4 flex flex-col hover:shadow-lg transition-shadow ml-${depth*2} mt-2`} key={comment.id}>
            <p className="text-gray-900 font-semibold">{'author' in comment ? comment.author.userName : comment.authorUserName}
                {showId && <span className="text-gray-600 text-sm ml-2 font-normal">User ID: {'author' in comment ? comment.author.id : comment.authorUserId}</span>}
                {author && (
                    <span className="text-gray-600 font-normal ml-1 mr-1">
                        replied to
                    </span>
                )}
                {author && (author.userName)}
                {showId && author && (
                    <span className="text-gray-600 text-sm ml-2 font-normal">User ID: {author.id}</span>
                )}
                <span className="text-gray-600 font-normal ml-2">
                    {new Date(comment.commentedAt).toLocaleString()}
                </span>
            </p>

            {comment.isDeleted && <p className="text-red-600 text-sm">Deleted at {new Date(comment.deletedAt).toLocaleString()}</p>}

            {showId && <p className="text-gray-600 text-sm">Comment ID: {comment.id}</p>}

            <p 
                className={comment.isDeleted ? "text-gray-600 text-sm italic mt-1" : "text-gray-900"}
            >
                {comment.commentMessage}
            </p>
            
            {comment.latitude && comment.longitude && (
                <p className="text-gray-600 text-sm mt-1">{address?.address.road}{address?.address.house_number ? `, ${address?.address.house_number}` : ''}</p>
            )}

            {editMode && (
                <div className="flex flex-col gap-2 mt-2">
                    <p className="text-gray-900">
                        <span className="text-gray-600 text-sm">Details: </span>

                        <textarea
                            placeholder="Message"
                            defaultValue={editedMessage}
                            className="bg-white rounded-2xl shadow-sm border-solid pl-4 m-1 p-2 w-full
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setEditedMessage(e.target.value)}
                        />
                    </p>
                </div>
            )}

            {manageMode && (
                comment.isDeleted ? (null) : (
                    <div className="flex gap-2 mt-2 mb-1">
                        {editMode ?
                            (
                                <Button
                                    variant="edit"
                                    size="sm"
                                    onClick={() => {
                                        setEditMode(false);
                                        editComment && editComment(comment.announcementId, comment.id, editedMessage, editedImageUrl, editedLatitude, editedLongitude, editedLocationDescription);
                                    }}
                                >
                                    Save
                                </Button>
                            ) :
                            (
                                <Button
                                    variant="edit"
                                    size="sm"
                                    onClick={() => setEditMode(true)}
                                >
                                    Edit
                                </Button>
                            )
                        }
                        
                        
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteComment && deleteComment(comment.announcementId, comment.id)}
                        >
                            Delete
                        </Button>
                    </div>
                )
            )}

            {
            comment.replies && comment.replies.map((reply: any) => (
                <Comment comment={reply} depth={depth + 1} author={comment.author} showId={showId} key={reply.id} />
            ))}
        </div>
    );
}