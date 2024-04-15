import { Dispatch, SetStateAction } from "react";
import Comment from "./Comment";
import TextareaAutosize from "react-textarea-autosize";
import { useUserContext } from "../../contexts/userContext";

const CommentModal = ({
  status,
  toggleShow,
}: {
  status: boolean;
  toggleShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useUserContext();

  return (
    <div className="w-[30%] bg-slate-200 fixed right-0 top-0 min-h-screen">
      {user !== undefined ? (
        <div className="p-5 w-full flex flex-col items-center gap-3">
          <TextareaAutosize className="w-full resize-none min-h-[80px] p-3 rounded-md shadow-md outline-none" placeholder="Write your thoughts..."/>
          <button className="bg-emerald-500 rounded-md py-2 px-5 ml-auto shadow-md text-white">Submit</button>
        </div>
      ) : (
        ""
      )}

      <Comment />
      <Comment />
      <Comment />
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
