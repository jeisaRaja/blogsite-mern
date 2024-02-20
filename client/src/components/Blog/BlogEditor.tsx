import AnimationWrapper from "../../common/animation";
import defaultBanner from "../../assets/blog banner.png";
import axios, { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useUserContext } from "../../contexts/userContext";
import { BlogPost, useEditorContext } from "../../contexts/editorContext";
import { Tiptap } from "./TipTap";
import AddTag from "./AddTag";
import DraftList from "./DraftList";

const BlogEditor = () => {
  const bannerRef = useRef<HTMLImageElement>(null);
  const { user } = useUserContext();
  const { blog, setBlog } = useEditorContext();
  const [drafts, setDrafts] = useState<Array<BlogPost>>([]);

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
          Authorization: `Bearer ${user?.access_token}`,
        },
        data: formData,
      });
      console.log(res);
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
      console.log("blog", blog);
      if (!blog.title || blog.title.length < 10) {
        return toast.error("Title length must be at least 10 characters");
      }
      toast.loading("Saving...");
      const res = await axios.post(
        `${import.meta.env.VITE_API_ROUTE}/editor/draft`,
        blog,
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        }
      );
      if (res.status == 200) {
        toast.dismiss();
        toast.success("Blog Saved ✅");
      }
    } catch (e) {
      toast.dismiss();
      toast.error((e as AxiosError).message);
    }
  };

  const getDrafts = useCallback(async (access_token: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_ROUTE}/editor/draft`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDrafts(user?.access_token || "");
        if (response) {
          setDrafts(response); // Use await here, assuming response is the array of drafts
        }
        const { access_token, ...userWithoutToken } = user || {};
        setBlog((prevBlog) => ({ ...prevBlog, author: userWithoutToken }));
      } catch (error) {
        console.error(error);
      }
    };

    if (user !== null) {
      fetchData();
    }
  }, [user, setBlog, getDrafts]);

  return (
    <>
      <nav className="navbar">
        <p className="max-md:hidden text-black line-clamp-1 w-full ">
          New Blog
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>
      <AnimationWrapper>
        <Toaster />
        <section>
          <div className="mx-auto max-w-[900px] w-full px-10">
            {console.log(drafts.length)}
            {drafts.length > 0 ? <DraftList drafts={drafts} /> : " "}
            <div className="relative aspect-video bg-white border-grey hover:opacity-80">
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
            <textarea
              placeholder="Title"
              className="text-4xl w-full outline-none mt-4 font-medium resize-none h-auto"
              onKeyDown={restrictEnterKey}
              onChange={handleEditorChange}
              name="title"
            ></textarea>
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
