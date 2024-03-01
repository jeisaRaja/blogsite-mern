import { BlogPost, useEditorContext } from "../../contexts/editorContext";

interface DraftListProps {
  drafts: BlogPost[];
}
const DraftList = ({ drafts }: DraftListProps) => {
  const { setBlog, setLoadDraftClicked, setTags } = useEditorContext();
  const handleDraftClick = (i: number) => {
    const draft = drafts[i];
    setBlog(draft);
    setLoadDraftClicked(true);
    setTags(draft.tags);
  };

  return (
    <div className="w-full min-h-[100px] max-w-[900px] mx-auto px-10">
      <h2 className="my-2">Your Drafts</h2>
      <div className="w-full flex gap-4 justify-between">
        {drafts.map((draft, i) => {
          return (
            <div
              key={i}
              className="w-full rounded-md bg-white shadow-md border-2 border-solid border-gray-100 p-2 cursor-pointer hover:opacity-60"
              onClick={() => {
                handleDraftClick(i);
              }}
            >
              <img
                src={draft.banner}
                alt=""
                className="w-full h-[80px] object-cover mb-2"
              />
              {draft.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DraftList;
