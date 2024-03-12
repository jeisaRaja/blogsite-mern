import AnimationWrapper from "../../common/animation";
import defaultBanner from "../../../images/blog banner.png";
import axios, { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import React, { ChangeEvent, useEffect, useRef } from "react";
import { useUserContext } from "../../contexts/userContext";
import { useEditorContext } from "../../contexts/editorContext";
import { Tiptap } from "./TipTap";
import AddTag from "./AddTag";

const BlogEditor = () => {
  const bannerRef = useRef<HTMLImageElement>(null);
  const auth = useUserContext();
  const { blog, setBlog } = useEditorContext();

  function restrictEnterKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") return e.preventDefault();
  }

  function handleEditorChange(
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setBlog({
      ...blog,
      [e.target.name]: e.target.value,
    });
  }

  const uploadBanner = async (img: File) => {
    const apiAddr = import.meta.env.VITE_API_ROUTE;
    const formData = new FormData();
    formData.append("image", img);
    try {
      const res = await axios({
        method: "POST",
        url: `${apiAddr}/upload-image`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
        withCredentials: true,
      });
      return res.data.publicUrl;
    } catch (e) {
      toast.error("something went wrong");
      console.log(e);
    }
  };

  const handleBannerUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (!e.target.files) return;
    const img = e.target.files[0];
    if (img) {
      try {
        toast.loading("Uploading...", { id: "loading" });
        const imgUrl = await uploadBanner(img);
        if (bannerRef.current) {
          bannerRef.current.src = imgUrl;
        }
        if (imgUrl) {
          toast.success("Banner uploaded 👌");
          setBlog({ ...blog, banner: imgUrl });
        }
      } catch (e) {
        toast.error("Something went wrong");
      } finally {
        toast.dismiss("loading");
      }
    }
  };

  const handleSaveDraft = async () => {
    try {
      if (!blog.title || blog.title.length < 10) {
        return toast.error("Title length must be at least 10 characters");
      }
      toast.loading("Saving...");
      const method = blog._id === "" ? "POST" : "PUT";
      const res = await axios({
        withCredentials: true,
        data: blog,
        url: `${import.meta.env.VITE_API_ROUTE}/editor/draft`,
        method: method,
      });
      if (res.status == 200) {
        toast.dismiss();
        setBlog((prevBlog) => ({ ...prevBlog, _id: res.data }));
        toast.success("Blog Saved ✅");
      }
    } catch (e) {
      toast.dismiss();
      const axiosError = e as AxiosError;
      const responseData = axiosError.response?.data;
      if (typeof responseData === "string") {
        toast.error(responseData);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handlePublish = async () => {
    try {
      if (!blog.title || blog.title.length < 10) {
        return toast.error("Title length must be at least 10 characters");
      }
      toast.loading("Publishing...");
      const method = blog._id === "" ? "POST" : "PUT";
      const res = await axios({
        withCredentials: true,
        data: blog,
        url: `${import.meta.env.VITE_API_ROUTE}/editor/draft`,
        method: method,
      });
      if (res.status == 200) {
        toast.dismiss();
        setBlog((prevBlog) => ({ ...prevBlog, _id: res.data }));
        toast.success("Blog Published ✅");
      }
    } catch (e) {
      toast.dismiss();
      const axiosError = e as AxiosError;
      const responseData = axiosError.response?.data;
      if (typeof responseData === "string") {
        toast.error(responseData);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    const { ...data } = auth.user;
    setBlog((prevBlog) => ({ ...prevBlog, author: data }));
    if (blog.banner !== "") {
      if (bannerRef.current) {
        bannerRef.current.src = blog.banner;
      }
    }
  }, [blog.banner, auth.user, setBlog, blog.title, blog.content]);

  return (
    <>
      <nav className="navbar">
        <div className="flex gap-4 mx-auto p-10 max-w-[900px]">
          <button
            className="p-2 w-[6rem] bg-gray-900 text-white rounded-md hover:bg-gray-700"
            onClick={handlePublish}
          >
            Publish
          </button>
          <button
            className="p-2 w-[6rem] border border-black rounded-md outline-none hover:bg-gray-100"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
        </div>
      </nav>
      <AnimationWrapper>
        <Toaster />
        <section>
          <div className="mx-auto max-w-[900px] w-full px-10">
            <textarea
              placeholder="Write Your Title Here"
              className="text-4xl w-full outline-none mt-4 font-medium resize-none h-auto"
              onKeyDown={restrictEnterKey}
              onChange={handleEditorChange}
              name="title"
              value={blog.title}
            ></textarea>
            <div className="relative aspect-video bg-white border-grey hover:opacity-80 mb-5">
              <label htmlFor="uploadBanner">
                <img
                  src={defaultBanner}
                  ref={bannerRef}
                  alt=""
                  className="z-20 object-cover w-full h-full"
                />
                <input
                  type="file"
                  id="uploadBanner"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>
          </div>
        </section>
        <section
          className="mx-auto max-w-[900px] px-10 flex flex-col justify-center"
          id="textEditorContainer"
        >
          <Tiptap />
          <AddTag />
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
