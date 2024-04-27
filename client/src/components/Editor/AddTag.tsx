import { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BlogPost } from "../../contexts/editorContext";

const AddTag = ({blog, setBlog}:{blog:BlogPost,setBlog:Dispatch<SetStateAction<BlogPost>>}) => {
  const [input, setInput] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleEnterTag(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") {
      return;
    }
    if (input.trim() !== "" && !blog.tags.includes(input)) {
      setBlog((prevBlog) => ({
        ...prevBlog,
        tags: [...prevBlog.tags, input.trim()],
      }));
      setInput("");
      if (ref.current) {
        ref.current.value = "";
      }
    } else if (blog.tags.includes(input)) {
      toast.error("Redundant tag");
      return;
    }
  }

  function handleRemoveTag(tag: string) {
    setBlog((prevBlog) => ({
      ...prevBlog,
      tags: prevBlog.tags.filter((theTag) => tag != theTag),
    }));
  }

  useEffect(() => {
  }, [blog.tags]);

  return (
    <div className="w-full flex flex-col gap-2 mb-5">
      <input
        type="text"
        className="border rounded-md border-gray-300 p-2"
        placeholder="Add tags"
        onChange={handleInputChange}
        onKeyDown={handleEnterTag}
        ref={ref}
      />
      <div className="flex w-full min-h-5 gap-2">
        {blog.tags.map((tag) => {
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
