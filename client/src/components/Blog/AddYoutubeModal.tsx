import { Editor } from "@tiptap/react";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";

interface AddYoutubeModaProps {
  editor: Editor;
  setModal: Dispatch<SetStateAction<boolean>>;
}
const AddYoutubeModal = ({ editor, setModal }: AddYoutubeModaProps) => {
  const [input, setInput] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input) {
      editor.commands.setYoutubeVideo({
        src: input,
      });
    }
  };
  return (
    <div
      className="w-full max-w-[900px] fixed p-8 bottom-0 z-10"
      id="modalContent"
    >
      <div
        className="w-[200px] bg-white rounded-md mb-[4.7rem] bottom-[2rem] p-4 border-gray-300 border-solid border-[1.5px] shadow-md z-40"
        id="modal"
      >
        <button onClick={() => setModal(false)} className="cursor-pointer">
          <i className="fi fi-rr-cross-circle"></i>
        </button>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col gap-1 jcc aic"
        >
          <input
            onChange={(e) => handleChange(e)}
            className="p-2 rounded-md outline-none border-solid border-gray-300 border-2"
            placeholder="Youtube Link"
          />
          <button
            className="p-2 w-full border border-gray-300 hover:bg-gray-100 shadow-md rounded-md"
            onClick={() => handleSubmit}
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddYoutubeModal;
