import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import { Editor } from "@tiptap/react";

interface AddLinkBoxProps {
  editor: Editor;
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
}
const AddLinkBox = ({ editor, setModal }: AddLinkBoxProps) => {
  const [input, setInput] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const setlink = (input: string) => {
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: input })
      .run();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setlink(input);
    setModal(false);
    setInput("");
  };
  return (
    <div className="w-full bg-white rounded-md p-4 relative border-gray-300 border-solid border-[1.5px] shadow-md">
      <button onClick={() => setModal(false)} className="hover:opacity-30">
        <i className="fi fi-rr-cross-circle"></i>
      </button>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-1"
      >
        <input
          onChange={(e) => handleChange(e)}
          className="p-2 border-solid border-gray-300 outline-none border-2"
          placeholder="Insert URL"
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

export default AddLinkBox;
