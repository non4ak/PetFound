import {  getAllComments, getCommentsByAnnouncementId, deleteComment } from "../../data/queries/comments";
import { useEffect, useState } from "react";
import type { CommentSecondDto } from "@/types/comments";
import { Comment } from "@/components/ui/Comment";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";

export const Comments = () => {
    const [comments, setComments] = useState<CommentSecondDto[]>([]);
    const [showIds, setShowIds] = useState(false);

    const [pageSize, setPageSize] = useState(20);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [statusFilter, setStatusFilter] = useState<boolean | null>(null);

    const [searchId, setSearchId] = useState<number | null>(null);

    const fetchComments = async () => {
        const commentsData = await getAllComments(searchId ? searchId : null, pageNumber, pageSize ? pageSize : 20, statusFilter);
        setComments(commentsData.items);
        setTotalComments(commentsData.totalCount);
        setTotalPages(commentsData.totalPages);
    };
    
    const handleNextPage = async () => {
        if ((pageNumber+1) < totalPages) setPageNumber(pageNumber+1);
    }

    const handlePrevPage = async () => {
        if (pageNumber > 0) setPageNumber(pageNumber-1);
    }

    const handleDeleteComment = async (announcementId: number, commentId: number) => {
        await deleteComment(announcementId, commentId);
        fetchComments();
    }

    useEffect(() => {
        fetchComments();
    }, [pageNumber, pageSize, searchId, statusFilter]);

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Comments</h1>

            <p className="text-gray-900 mb-1">
                Manage comments.
            </p>

            <div className="flex flex-col">
                <div className="inline-flex items-center gap-4">
                    <p className="text-gray-600 mb-1">
                        Toggle the visibility of IDs:
                    </p>
                    <Button variant="toggle" isActive={showIds} onClick={() => setShowIds(!showIds)} className="opacity-50">
                        Toggle ID's
                    </Button>
                </div>

                <div className="grid grid-cols-2 mb-5 mt-2">
                    <div className="inline-flex items-center gap-4">
                        <p className="text-gray-900 mb-1">
                            Search by announcement ID:
                        </p>
                        <input
                            type="text"
                            placeholder="ID"
                            className="bg-white rounded-2xl shadow-sm border-solid p-2 pl-4
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) => setSearchId(Number(e.target.value))}
                        />
                    </div>

                    <div className="flex flex-col pr-4 items-center gap-2">
                        <p className="text-gray-900 text-mb">Status</p>
                        <div className="flex gap-2">
                            <Button variant={statusFilter === null ? "primary" : "secondary"} onClick={() => setStatusFilter(null)} size="sm">
                                All
                            </Button>
                            <Button variant={statusFilter === false ? "primary" : "secondary"} onClick={() => setStatusFilter(false)} size="sm">
                                Active
                            </Button>
                            <Button variant={statusFilter === true ? "primary" : "secondary"} onClick={() => setStatusFilter(true)} size="sm">
                                Deleted
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                {comments.map((comment) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        showId={showIds}
                        manageMode={true}
                        deleteComment={handleDeleteComment}
                    />
                ))}
            </div>
            <Pagination
                prevPage={handlePrevPage}
                nextPage={handleNextPage}
                currentPage={pageNumber + 1}
                onChangeTotalPages={setPageSize}
            />
        </div>
    )
}