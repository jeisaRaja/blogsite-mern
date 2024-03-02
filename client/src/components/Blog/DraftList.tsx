import axios from "axios";
import { BlogPost, useEditorContext } from "../../contexts/editorContext";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

interface DraftListProps {
  drafts: BlogPost[];
  setDraftsUpdated: Dispatch<SetStateAction<boolean>>;
}
const DraftList = ({ drafts, setDraftsUpdated }: DraftListProps) => {
  const { setBlog, setLoadDraftClicked, setTags } = useEditorContext();

  const handleDraftClick = (i: number) => {
    const draft = drafts[i];
    setBlog(draft);
    setLoadDraftClicked(true);
    setTags(draft.tags);
  };

  const deleteDraft = async (i: number) => {
    const draft = drafts[i];
    const data = {
      blog_id: draft.blog_id,
      author: draft.author,
    };
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_ROUTE}/editor/draft`,
        {
          data: data,
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setDraftsUpdated(true);
        toast.success("Draft deleted");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-full min-h-[100px] max-w-[900px] mx-auto px-10">
      <h2 className="my-2">Your Drafts</h2>
      <div className="w-full flex gap-4 justify-between">
        {drafts.map((draft, i) => {
          return (
            <div
              key={i}
              className="w-full rounded-md bg-white shadow-md border-2 border-solid border-gray-100 p-2  relative"
            >
              <img
                src={draft.banner}
                alt=""
                className="w-full h-[80px] object-cover mb-2 hover:opacity-60 cursor-pointer"
                onClick={() => {
                  handleDraftClick(i);
                }}
              />
              <div className="flex justify-between">
                <p>{draft.title}</p>
                <i
                  className="fi fi-rs-trash hover:text-red-400 cursor-pointer"
                  onClick={() => {
                    deleteDraft(i);
                  }}
                ></i>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DraftList;
