import {  getAllComments, getCommentsByAnnouncementId } from "../../data/queries/comments";
import { useEffect, useState } from "react";
import type { CommentSecondDto } from "@/types/comments";
import { Comment } from "@/components/ui/Comment";
import { Button } from "@/components/ui/Button";

export const Comments = () => {
    const [comments, setComments] = useState<CommentSecondDto[]>([]);
    const [showIds, setShowIds] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            const commentsData = await getAllComments();
            setComments(commentsData.items);
      ***REMOVED***;

        fetchComments();
  ***REMOVED***, []);

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Comments</h1>

            <p className="text-gray-900 mb-1">
                Manage comments.
            </p>

            <div className="inline-flex items-center gap-4">
                <p className="text-gray-600 mb-1">
                    Toggle the visibility of IDs:
                </p>
                <Button variant="toggle" isActive={showIds} onClick={() => setShowIds(!showIds)} className="opacity-50">
                    Toggle ID's
                </Button>
            </div>

            <div className="flex flex-col gap-1">
                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} showId={showIds} depth={0} />
                ))}
            </div>
        </div>
    )
}