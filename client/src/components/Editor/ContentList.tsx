import { Link, useNavigate } from "react-router-dom";
import { BlogPost, useEditorContext } from "../../contexts/editorContext";
import { Dispatch, SetStateAction } from "react";

interface ContentListProps {
  type: "blogs" | "drafts";
  blogs: BlogPost[];
  setDraftsUpdated?: Dispatch<SetStateAction<boolean>>;
}

const ContentList = ({ type, blogs }: ContentListProps) => {
  const navigate = useNavigate();
  const handleView = (i: number) => {
    const blog = blogs[i];
    navigate(`/blog/${blog.blog_id}`);
  };

  return (
    <div className="w-full min-h-[100px] max-w-[900px] mx-auto px-10 my-10">
      <h2 className="my-2">Your {type}</h2>
      <div className="w-full grid grid-cols-2 gap-4">
        {blogs.map((blog, i) => {
          return (
            <div
              key={i}
              className="basis-[50%] rounded-md bg-white shadow-lg border-2 border-solid border-gray-200 p-2 relative cursor-pointer box-border"
            >
              <img
                src={blog.banner}
                alt=""
                className="w-full h-[250px] object-cover mb-2"
              />
              <p className="font-bold">{blog.title}</p>

              <div className="flex gap-3 py-3">
                <Link
                  to={`/editor/${blog.blog_id}`}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-300"
                >
                  <i className="fi fi-rr-pencil"></i>
                </Link>
                <Link
                  to={`/blog/${blog.blog_id}`}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-300"
                >
                  <i className="fi fi-rr-eye"></i>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContentList;
