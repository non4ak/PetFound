interface CommentProps {
    comment: any;
    depth: number;
    author?: any;
    showId: boolean;
}

export const Comment = ({ comment, depth, author, showId }: CommentProps) => {

    return (
        <div className={`bg-white rounded-2xl shadow-sm pl-4 pb-2 pt-2 pr-4 flex flex-col hover:shadow-lg transition-shadow ml-${depth*2} mt-1`} key={comment.id}>
            <p className="text-gray-900 font-semibold">{comment.author.userName}
                {showId && <span className="text-gray-600 text-sm ml-2 font-normal">User ID: {comment.author.id}</span>}
                {comment.parentCommentId && (
                    <span className="text-gray-600 font-normal ml-1 mr-1">
                        replied to
                    </span>
                )}
                {author && (author.userName)}
                {showId && author && (
                    <span className="text-gray-600 text-sm ml-2 font-normal">User ID: {author.id}</span>
                )}
                <span className="text-gray-600 font-normal ml-2">
                    {new Date(comment.commentedAt).toLocaleDateString()}
                </span>
            </p>
            {showId && <p className="text-gray-600 text-sm">Comment ID: {comment.id}</p>}
            <p className="text-gray-900">{comment.commentMessage}</p>
            {comment.replies.map((reply: any) => (
                <Comment comment={reply} depth={depth + 1} author={comment.author} showId={showId} key={reply.id} />
            ))}
        </div>
    );
}