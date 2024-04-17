import TextareaAutosize from "react-textarea-autosize";
import { useUserContext } from "../../contexts/userContext";
import { useParams } from "react-router-dom";
import { FormEvent, useState } from "react";
import axios from "axios";
import { Comment } from "../../common/interfaces";

const CommentInput = ({
  onAddComment,
  parentComment,
}: {
  onAddComment: (newComment: Comment) => void;
  parentComment?: string | undefined;
}) => {
  const params = useParams();
  const blogId = params.blogId;
  const { user } = useUserContext();
  const [commentText, setCommentText] = useState("");

  async function postComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let isReply: boolean;
    parentComment !== undefined ? (isReply = true) : (isReply = false);
    console.log(parentComment, isReply);
    const data = {
      blog_id: blogId,
      comment: commentText,
      commented_by: user?.user_id,
      isReply,
      parent: parentComment,
    };
    const res = await axios.post(
      `${import.meta.env.VITE_API_ROUTE}/blogs/id/${blogId}/comment`,
      data,
      { withCredentials: true }
    );
    console.log(res);
    if (!isReply) {
      onAddComment(res.data.comment);
    }
  }

  return (
    <form
      className="p-5 w-full flex flex-col items-center gap-3 "
      onSubmit={postComment}
    >
      <TextareaAutosize
        className="w-full resize-none min-h-[80px] p-3 rounded-md shadow-md outline-none  border-2 border-solid border-gray-200"
        placeholder="Write your thoughts..."
        onChange={(e) => {
          setCommentText(e.target.value);
        }}
      />
      <button
        className="bg-emerald-500 rounded-md py-2 px-5 ml-auto shadow-md text-white"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default CommentInput;
