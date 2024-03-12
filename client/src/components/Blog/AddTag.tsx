import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { useEditorContext } from "../../contexts/editorContext";

const AddTag = () => {
  const [input, setInput] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const { tags, setTags } = useEditorContext();
  const { setBlog } = useEditorContext();

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleEnterTag(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key == "Enter" && input.trim() !== "") {
      setTags([...tags, input.trim()]);
      setBlog((prevBlog) => ({
        ...prevBlog,
        tags: [...prevBlog.tags, input.trim()],
      }));
      setInput("");
      if (ref.current) {
        ref.current.value = "";
      }
    }
  }

  function handleRemoveTag(tag: string) {
    const filterTag = tags.filter((theTag) => theTag !== tag);
    setTags(filterTag);
    setBlog((prevBlog) => ({
      ...prevBlog,
      tags: prevBlog.tags.filter((theTag) => tag != theTag),
    }));
  }

  return (
    <div className="w-full flex flex-col gap-2 min-h-[100px] mb-[200px]">
      <input
        type="text"
        className="border rounded-md border-gray-300 min-h-[50px] p-2"
        placeholder="Add tags"
        onChange={handleInputChange}
        onKeyDown={handleEnterTag}
        ref={ref}
      />
      <div className="flex w-full mb-10 min-h-4 gap-2">
        {tags.map((tag) => {
          return (
            <div
              className="py-2 pr-6 pl-2 border border-gray-300 rounded-md relative"
              key={tag}
            >
              <button
                className="absolute right-1 top-[0.7rem] cursor-pointer hover:bg-gray-300 rounded-full"
                onClick={() => handleRemoveTag(tag)}
                key={tag}
              >
                <i className="fi fi-rr-cross-small"></i>
              </button>
              <p>{tag}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddTag;
