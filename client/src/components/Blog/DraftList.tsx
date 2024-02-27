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
    <div className="w-full min-h-[100px] bg-gray-200">
      {drafts.map((draft, i) => {
        return (
          <button
            key={i}
            className="block"
            onClick={() => {
              handleDraftClick(i);
            }}
          >
            {draft.title}
          </button>
        );
      })}
    </div>
  );
};

export default DraftList;
