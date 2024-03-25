import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlogDocument } from "../common/interfaces";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

const BlogPage = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState<null | BlogDocument>(null);
  const [like, setLike] = useState(false);

  const toggleLike = async () => {
    const api_route = `${import.meta.env.VITE_API_ROUTE}/blogs/like/id/${blogId}`;
    const res = await axios.get(api_route, { withCredentials: true });
  };

  useEffect(() => {
    const api_uri = `${import.meta.env.VITE_API_ROUTE}/blogs/id/${blogId}`;
    async function getBlogData() {
      const res = await axios.get(api_uri, { withCredentials: true });
      setBlog(res.data.blog);
      console.log(res);
    }
    getBlogData();
  }, [blogId]);

  return (
    <>
      <Navbar />
      <div className="mx-auto p-12 max-w-[1000px]">
        {blog && (
          <>
            <h1 className="font-bold text-5xl font-sans mb-[20px]">
              {blog.title}
            </h1>
            <div className="mb-[20px] flex gap-2 items-center h-[40px]">
              <img
                src={blog.author.personal_info.profile_img}
                className="h-full rounded-full"
                alt=""
              />
              <div className="flex flex-col justify-between ml-2">
                <p className="font-semibold">
                  {blog.author.personal_info.username}
                </p>
                <p>{new Date(blog.publishedAt).toDateString()}</p>
              </div>
            </div>
            <div className="flex w-full items-center border border-solid border-gray-400 rounded-md p-4 mb-[20px] gap-4">
              <div className="flex items-center gap-1">
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                  <i
                    onClick={toggleLike}
                    className={
                      "fi fi-rr-heart " + (like == true ? "text-red-600" : "")
                    }
                  ></i>
                </button>
                <p>{blog.activity?.total_likes}</p>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                  <i className="fi fi-rs-comment-dots"></i>
                </button>
                <p>{blog.activity?.total_comments}</p>
              </div>
            </div>
            {blog.banner && (
              <img src={blog.banner} className="w-full mb-[50px]" alt="" />
            )}
            {blog.content && (
              <div
                dangerouslySetInnerHTML={{ __html: blog.content }}
                className="text-xl"
                id="blogContent"
              ></div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default BlogPage;
