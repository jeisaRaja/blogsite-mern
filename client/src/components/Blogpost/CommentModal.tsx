import { Dispatch, SetStateAction } from "react";
import Comment from "./Comment";

const CommentModal = ({
  status,
  toggleShow,
}: {
  status: boolean;
  toggleShow: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="w-[30%] bg-slate-200 fixed right-0 top-0 min-h-screen">
      <Comment/>
      <Comment/>
      <Comment/>
      <div
        onClick={() => toggleShow(!status)}
        className="w-full cursor-pointer h-10 bg-slate-50 text-center flex flex-col justify-center absolute bottom-0 left-0"
      >
        <i className="fi fi-rs-circle-xmark text-red-400"></i>
      </div>
    </div>
  );
};

export default CommentModal;
