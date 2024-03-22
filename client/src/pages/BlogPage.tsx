import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlogDocument } from "../common/interfaces";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

const BlogPage = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState<null | BlogDocument>(null);

  useEffect(() => {
    const api_uri = `${import.meta.env.VITE_API_ROUTE}/blogs/id/${blogId}`;
    async function getBlogData() {
      const res = await axios.get(api_uri);
      setBlog(res.data);
      console.log(res.data);
    }
    getBlogData();
  }, [blogId]);

  return (
    <>
      <Navbar />
      <div className="mx-auto p-12 max-w-[1000px]">
        <h1 className="font-bold mb-[100px] text-5xl font-sans">{blog?.title}</h1>
        {blog && blog.banner !== null ? <img src={blog.banner} className="w-full mb-[50px]" alt="" /> : ""}
        {blog && blog?.content !== null ? (
          <div dangerouslySetInnerHTML={{ __html: blog.content! }} className="text-xl" id="blogContent" ></div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default BlogPage;
