import { useNavigate } from "react-router-dom";
import { BlogPost, useEditorContext } from "../../contexts/editorContext";
import { Dispatch, SetStateAction } from "react";

interface DraftListProps {
  drafts: BlogPost[];
  setDraftsUpdated?: Dispatch<SetStateAction<boolean>>;
}
const DraftList = ({ drafts }: DraftListProps) => {
  const navigate = useNavigate();
  const { blog, setBlog, setTags, setLoadDraftClicked, loadDraftClicked } =
    useEditorContext();
  const handleDraftClick = (i: number) => {
    const draft = drafts[i];
    setBlog(draft);
    setTags(draft.tags);
    setLoadDraftClicked(true);
    console.log(loadDraftClicked, "dari draftlist");
    navigate("/editor?load=true", { state: [blog] });
  };

  return (
    <div className="w-full min-h-[100px] max-w-[900px] mx-auto px-10">
      <h2 className="my-2">Your Drafts</h2>
      <div className="w-full grid grid-cols-2 gap-4">
        {drafts.map((draft, i) => {
          return (
            <div
              key={i}
              className="basis-[50%] rounded-md bg-white shadow-md border-2 border-solid border-gray-100 p-2 relative cursor-pointer  hover:opacity-60 box-border"
              onClick={() => {
                handleDraftClick(i);
              }}
            >
              <img
                src={draft.banner}
                alt=""
                className="w-full h-[250px] object-cover mb-2"
              />
              <p className="font-bold">{draft.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DraftList;
