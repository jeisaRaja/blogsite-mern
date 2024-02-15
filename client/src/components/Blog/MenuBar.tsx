import { Editor } from "@tiptap/react";
import { useState } from "react";
import { AddImageLink } from "./AddImageModal";
type MenuBarProps = {
  editor: Editor;
};
const MenuBar = ({ editor }: MenuBarProps) => {
  const [imageModal, setImageModal] = useState(false);
  if (!editor) return null;

  return (
    <div className="w-full flex justify-start">
      <button
        onClick={() => {
          setImageModal(true);
        }}
        className="px-5 py-2 border-solid border-gray-300 border-2 mb-5 h-fit"
      >
        Add Image
      </button>
      {imageModal && (
        <div className="w-screen h-screen fixed left-0 top-0 -z-0">
          <AddImageLink editor={editor} setModal={setImageModal} />
        </div>
      )}
    </div>
  );
};

export default MenuBar;
