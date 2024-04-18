import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CommentDiv from "./Comment";
import CommentInput from "./CommentInput";
import { Comment } from "../../common/interfaces";

const CommentModal = ({
  status,
  toggleShow,
  initialComments,
}: {
  status: boolean;
  toggleShow: Dispatch<SetStateAction<boolean>>;
  initialComments: Array<Comment> | undefined;
}) => {
  const [comments, setComments] = useState<Array<Comment>>(
    initialComments || []
  );

  function handleAddComment(newComment: Comment) {
    if (newComment.isReply) {
      const parentCommentIndex = comments.findIndex(
        (c) => c._id === newComment.parent
      );
      if (parentCommentIndex !== -1) {
        const updatedComments = [...comments];
        updatedComments[parentCommentIndex].children.push(newComment);
        setComments(updatedComments.reverse());
      }
    } else {
      setComments([...comments, newComment]);
    }
  }

  useEffect(() => {
    console.log(comments);
  }, [comments]);
  return (
    <div className="w-[70%] md:w-[50%] lg:w-[30%] bg-white shadow-2xl fixed right-0 top-0 min-h-screen overflow-y-auto h-full pb-[40px]">
      <CommentInput onAddComment={handleAddComment} />
      {comments &&
        comments
          .reverse()
          .map((comment) => (
            <CommentDiv
              comment={comment}
              key={comment._id}
              commentKey={comment._id}
              onAddComment={handleAddComment}
              isChild={false}
            />
          ))}
      <div
        onClick={() => toggleShow(!status)}
        className="w-[70%] md:w-[50%] lg:w-[30%] cursor-pointer h-10 bg-slate-50 text-center flex flex-col justify-center fixed bottom-0 right-0"
      >
        <i className="fi fi-rs-circle-xmark text-red-400"></i>
      </div>
    </div>
  );
};

export default CommentModal;
