import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { BlogDocument } from "../common/interfaces";

const Home = () => {
  const [blogs, setBlogs] = useState<BlogDocument[]>([]);

  const getRecentBlogs = async () => {
    const api_url = `${import.meta.env.VITE_API_ROUTE}/blogs`;
    console.log(api_url);
    const res = await axios.get(api_url);
    setBlogs(res.data);
    console.log(res.data);
  };
  useEffect(() => {
    getRecentBlogs();
  }, []);
  return (
    <>
      <Navbar />
      <div className="mx-auto p-12 max-w-[1400px]">
        <h3>Recent Blogs</h3>
        <div className="grid grid-cols-3 gap-10">
          {blogs.map((blog) => {
            return (
              <div
                key={blog.blog_id}
                className="flex flex-col w-full border-solid border-gray-400 border relative max-h-[400px]"
              >
                <img
                  src={blog.banner!}
                  alt=""
                  className="w-full rounded-none h-[50%] object-cover"
                />
                <div className="p-4">
                  <h1 className="font-bold mb-2">{blog.title}</h1>
                  <div className="flex flex-row gap-3 absolute bottom-4 left-4">
                    {" "}
                    <img
                      src={blog.author.personal_info.profile_img}
                      alt=""
                      className="w-7 h-7 rounded-full"
                    />
                    <p>{blog.author.personal_info.fullname}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
