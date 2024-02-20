import { BlogPost } from "../../contexts/editorContext";

interface DraftListProps {
  drafts: BlogPost[];
}
const DraftList = ({ drafts }: DraftListProps) => {
  return (
    <div className="w-full min-h-[100px] bg-gray-200">
      {drafts.map((draft) => {
        return <h1>{draft.title}</h1>;
      })}
    </div>
  );
};

export default DraftList;
