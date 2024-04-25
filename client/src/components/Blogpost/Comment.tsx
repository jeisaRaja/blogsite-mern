import { useState } from "react";
import { useUserContext } from "../../contexts/userContext";
import CommentInput from "./CommentInput";
import { Comment } from "../../common/interfaces";
import axios from "axios";
import { useParams } from "react-router-dom";

const CommentDiv = ({
  comment,
  onAddComment,
  commentKey,
  isChild,
}: {
  comment: Comment;
  onAddComment: (newComment: Comment) => void;
  commentKey: string;
  isChild: boolean;
}) => {
  const [input, setInput] = useState(false);
  const { user } = useUserContext();
  const { blogId } = useParams();

  const handleDeleteComment = async () => {
    console.log("blogid is ", blogId)
    const res = await axios.delete(
      `${import.meta.env.VITE_API_ROUTE}/blogs/id/${blogId}/comment/${comment._id}`, {withCredentials: true}
    );
    console.log(res);
  };
  return (
    <div
      className={`flex flex-col gap-1 text-sm py-2 px-5 w-full border-solid border-gray-200 ${isChild ? "px-0 pl-5  ml-5" : "border-t-2"
        } `}
    >
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
        {user && user.user_id == comment.commented_by._id ? (
          <button onClick={() => handleDeleteComment()}>Delete</button>
        ) : (
          ""
        )}
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
