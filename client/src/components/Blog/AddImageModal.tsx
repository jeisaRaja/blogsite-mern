import { Editor } from "@tiptap/react";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";

interface AddImageLinkProps {
  editor: Editor;
  setModal: Dispatch<SetStateAction<boolean>>;
}
export const AddImageLink = ({ editor, setModal }: AddImageLinkProps) => {
  const [input, setInput] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const setlink = (url: string) => {
    editor.chain().focus().extendMarkRange("link").setImage({ src: url }).run();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>, url: string) => {
    e.preventDefault();
    setlink(url);
    setModal(false);
    setInput("");
  };
  return (
    <div className="w-[200px] bg-white rounded-md z-10 p-4 absolute left-[20%] border-gray-300 border-solid border-[1.5px] shadow-md">
      <button
        onClick={() => setModal(false)}
        className="absolute close pointer"
      >
        <i className="fi fi-rr-cross-circle"></i>
      </button>
      <form
        onSubmit={(e) => handleSubmit(e, input)}
        className="flex flex-col gap-1 jcc aic"
      >
        <label className="f-white smaller">
          <small className="ml-3">Add Image URL</small>
        </label>
        <input
          onChange={(e) => handleChange(e)}
          className="p-2 rounded-md outline-none border-solid border-gray-300 border-2"
        />
        <button
          className="p-2 w-full border border-gray-300 hover:bg-gray-100 shadow-md rounded-md"
          onClick={() => handleSubmit}
        >
          Add
        </button>
      </form>
    </div>
  );
};
