import { Editor } from "@tiptap/react";
import axios from "axios";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import toast from "react-hot-toast";

interface AddImageLinkProps {
  editor: Editor;
  setModal: Dispatch<SetStateAction<boolean>>;
}
export const AddImageLink = ({ editor, setModal }: AddImageLinkProps) => {
  const [input, setInput] = useState("");

  const uploadImage = async (img: File) => {
    const apiAddr = import.meta.env.VITE_API_ROUTE;
    const formData = new FormData();
    formData.append("image", img);
    try {
      const res = await axios({
        method: "POST",
        url: `${apiAddr}/upload-image`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
        withCredentials: true,
      });
      return res.data.publicUrl;
    } catch (e) {
      toast.error("something went wrong");
    }
  };

  const handleImageUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (!e.target.files) return;
    const img = e.target.files[0];
    if (img) {
      try {
        toast.loading("Uploading...", { id: "loading" });
        const imgUrl = await uploadImage(img);
        if (imgUrl) {
          toast.success("Image uploaded 👌");
          setlink(imgUrl);
          editor.commands.enter();
          setModal(false);
        }
      } catch (e) {
        toast.error("Something went wrong");
      } finally {
        toast.dismiss("loading");
      }
    }
  };

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
    editor.commands.enter();
    editor.commands.setBlockquote()
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
          onSubmit={(e) => handleSubmit(e, input)}
          className="flex flex-col gap-1 jcc aic"
        >
          <input
            onChange={(e) => handleChange(e)}
            className="p-2 rounded-md outline-none border-solid border-gray-300 border-2"
            placeholder="Image Link"
          />
          <button
            className="p-2 w-full border border-gray-300 hover:bg-gray-100 shadow-md rounded-md"
            onClick={() => handleSubmit}
          >
            Add
          </button>
          <label htmlFor="uploadImage">
            <div className="w-full h-full border-solid border border-gray-300 flex items-center justify-center rounded-md shadow-md hover:bg-gray-100 cursor-pointer p-2">
              Upload
            </div>
            <input
              type="file"
              id="uploadImage"
              accept=".png, .jpg, .jpeg"
              hidden
              onChange={handleImageUpload}
            />
          </label>
        </form>
      </div>
    </div>
  );
};
