import { Editor } from "@tiptap/react";
import { useState } from "react";
import { AddImageLink } from "./AddImageModal";
import AddYoutubeModal from "./AddYoutubeModal";
type MenuBarProps = {
  editor: Editor;
};
const MenuBar = ({ editor }: MenuBarProps) => {
  const [imageModal, setImageModal] = useState(false);
  const [youtubeModal, setYoutubeModal] = useState(false);

  if (!editor) return null;

  return (
    <div className="mx-auto w-full max-w-[900px] relative bottom-0 z-40">
      <div className="w-fit fixed bottom-0 flex justify-start p-4 gap-2 rounded-md border border-solid items-center border-gray-300 mb-4 z-50 bg-white shadow-md">
        <button
          onClick={() => {
            setImageModal(true);
            setYoutubeModal(false);
          }}
          className="h-12 w-12 pt-2 bg-white shadow-md border-solid border-gray-300 border-2 rounded-full flex justify-center items-center z-50 hover:bg-gray-200 cursor-pointer"
        >
          <i className="fi fi-br-picture text-2xl text-gray-800"></i>
        </button>
        <button
          onClick={() => {
            setYoutubeModal(true);
            setImageModal(false);
          }}
          className="h-12 w-12 pt-2 bg-white shadow-md border-solid border-gray-300 border-2 rounded-full flex justify-center items-center z-50 hover:bg-gray-200 cursor-pointer"
        >
          <i className="fi fi-brands-youtube text-2xl text-gray-800"></i>
        </button>
      </div>
      {imageModal && (
        <div
          id="modalScreen"
          className="w-screen h-screen fixed bottom-0 left-0 z-40 flex justify-center"
          onClick={(e) => {
            const targetId = (e.target as HTMLElement).id;
            console.log(e.target);
            if (targetId == "modalScreen" || targetId == "modalContent") {
              setImageModal(false);
            }
          }}
        >
          <AddImageLink editor={editor} setModal={setImageModal} />
        </div>
      )}
      {youtubeModal && (
        <div
          id="modalScreen"
          className="w-screen h-screen fixed bottom-0 left-0 z-40 flex justify-center"
          onClick={(e) => {
            const targetId = (e.target as HTMLElement).id;
            console.log(e.target);
            if (targetId == "modalScreen" || targetId == "modalContent") {
              setYoutubeModal(false);
            }
          }}
        >
          <AddYoutubeModal editor={editor} setModal={setYoutubeModal} />
        </div>
      )}
    </div>
  );
};

export default MenuBar;
