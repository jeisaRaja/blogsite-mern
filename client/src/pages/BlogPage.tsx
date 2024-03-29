import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BlogDocument } from "../common/interfaces";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import { useUserContext } from "../contexts/userContext";

const BlogPage = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState<null | BlogDocument>(null);
  const [like, setLike] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const { user } = useUserContext();

  const toggleLike = async () => {
    const api_route = `${
      import.meta.env.VITE_API_ROUTE
    }/blogs/like/id/${blogId}`;
    await axios.post(api_route, {}, { withCredentials: true });
    setLike(!like);
    setLikeCount((prevCount) => (like ? prevCount - 1 : prevCount + 1));
  };

  useEffect(() => {}, [like]);

  useEffect(() => {
    const api_uri = `${import.meta.env.VITE_API_ROUTE}/blogs/id/${blogId}`;
    async function getBlogData() {
      const res = await axios.get(api_uri, { withCredentials: true });
      setBlog(res.data.blog);
      setLike(res.data.like);
      setLikeCount(res.data.blog.activity?.total_likes || 0);
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
                <button
                  className={
                    "w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 " +
                    (like == true ? "text-red-600 bg-red-100" : "")
                  }
                  onClick={toggleLike}
                >
                  <i className={"fi fi-rr-heart"}></i>
                </button>
                <p>{likeCount}</p>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                  <i className="fi fi-rs-comment-dots"></i>
                </button>
                <p>{blog.activity?.total_comments}</p>
              </div>
              {user?.user_id == blog.author._id ? (
                <div className="flex items-center gap-1">
                  <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                    <Link to={`/editor/${blog.blog_id}`}>
                      <i className="fi fi-rr-pencil"></i>
                    </Link>
                  </button>
                </div>
              ) : (
                ""
              )}
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
            <div className="w-full min-h-10 mt-[100px] border-solid border-t-2 py-2">
              <h3>Comments</h3>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BlogPage;
