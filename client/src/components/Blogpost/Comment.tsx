import { useState } from "react";
import { useUserContext } from "../../contexts/userContext";
import CommentInput from "./CommentInput";
import { Comment } from "../../common/interfaces";

const CommentDiv = ({
  comment,
  onAddComment,
  commentKey,
  isChild,
}: {
  comment: Comment;
  onAddComment: (newComment: Comment) => void;
  commentKey: string;
  isChild: boolean
}) => {
  const [input, setInput] = useState(false);
  const { user } = useUserContext();
  return (
    <div className="flex flex-col gap-1 text-sm py-2 px-5 w-full border-t-2 border-solid border-gray-300">
      <div className="flex items-center gap-2">
        <img
          src={comment.commented_by.personal_info.profile_img}
          className="w-8 h-8 rounded-full"
          alt=""
        />
        <div className="">
          <p>{comment.commented_by.personal_info.username}</p>
          <p className="text-gray-500">
            {new Date(comment.commentedAt).toLocaleString()}
          </p>
        </div>
      </div>
      <p>{comment.comment}</p>
      <div className="flex gap-5 mt-2 relative items-center">
        <i className="fi fi-rr-social-network text-lg"></i>
        <i className="fi fi-rr-beacon text-lg"></i>
        {!isChild && user !== undefined ? (
          <>
            <button
              className="right-0 absolute"
              onClick={() => setInput(!input)}
            >
              Reply
            </button>
          </>
        ) : (
          ""
        )}
      </div>
      {comment.children.map((comment) => (
        <CommentDiv
          comment={comment}
          key={comment._id}
          commentKey={comment._id}
          onAddComment={onAddComment}
          isChild={true}
        />
      ))}
      {!comment.isReply && input ? (
        <CommentInput onAddComment={onAddComment} parentComment={commentKey} />
      ) : (
        ""
      )}
    </div>
  );
};

export default CommentDiv;
