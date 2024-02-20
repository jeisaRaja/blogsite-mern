import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import MenuBar from "./MenuBar";
import AddLinkBox from "./AddLinkModal";
import { useState } from "react";
import Typography from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditorContext } from "../../contexts/editorContext";

export const Tiptap = () => {
  const [linkModal, setLinkModal] = useState(false);
  const { blog, setBlog } = useEditorContext();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Image,
      Link,
      Typography,
      Placeholder.configure({
        placeholder: "Write something...",
      }),
      Youtube.configure({
        inline: true,
        modestBranding: true,
      }),
    ],
    content: "<p>",
    editorProps: {
      attributes: {
        class: "min-h-[150px] outline-none rounded-md mb-[200px]",
      },
    },
    onUpdate({ editor }) {
      setBlog({ ...blog, content: editor.getHTML() });
    },
  });

  return (
    <div className="w-full">
      <MenuBar editor={editor!} />
      <EditorContent editor={editor}>
        <div id="textEditor" className="relative">
          <BubbleMenu
            editor={editor!}
            className="px-4 py-3 flex flex-col justify-end gap-2"
          >
            {linkModal && (
              <AddLinkBox
                editor={editor!}
                setModal={setLinkModal}
                modal={linkModal}
              />
            )}
            <div className="h-[2w-[300px] shadow-md px-4 py-3 flex gap-2 rounded-md border-[1px] border-gray-300 border-solid bg-white relative">
              <select
                className="p-2 shadow-md rounded-md border-[1px] border-gray-300 h-[2.5rem]"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "Normal text") {
                    editor?.chain().focus().unsetAllMarks().run();
                  } else {
                    const level = parseInt(value.split(" ")[1]) as 1 | 2 | 3;
                    editor?.chain().focus().setHeading({ level: level }).run();
                  }
                }}
              >
                <option>Normal text</option>
                <option>Heading 1</option>
                <option>Heading 2</option>
                <option>Heading 3</option>
              </select>
              <button
                className="w-10 h-10 border-solid border-[1px] shadow-md hover:bg-gray-100"
                onClick={() => {
                  editor?.chain().focus().toggleBold().run();
                }}
              >
                <i className="fi fi-br-bold"></i>
              </button>
              <button
                className="w-10 h-10 border-solid border-[1px] shadow-md hover:bg-gray-100"
                onClick={() => {
                  editor?.chain().focus().toggleItalic().run();
                }}
              >
                <i className="fi fi-br-italic"></i>
              </button>
              <button
                className="w-10 h-10 border-solid border-[1px] shadow-md hover:bg-gray-100"
                onClick={() => {
                  setLinkModal((prev) => !prev);
                }}
              >
                <i className="fi fi-br-link-alt"></i>
              </button>
            </div>
          </BubbleMenu>
        </div>
      </EditorContent>
    </div>
  );
};
