import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { BlogPost } from "../contexts/editorContext";
import axios from "axios";
import DraftList from "../components/Editor/ContentList";
import { useUserContext } from "../contexts/userContext";

const Dashboard = () => {
  const [drafts, setDrafts] = useState<Array<BlogPost>>([]);
  const [blogs, setBlogs] = useState<Array<BlogPost>>([]);
  const [fetched, setFetched] = useState(false);
  const [fetchBlogs, setFetchBlogs] = useState(false);
  const { user } = useUserContext();
  useEffect(() => {
    const getDrafts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_ROUTE}/editor`,
          {
            withCredentials: true,
          }
        );
        return res.data;
      } catch (error) {
        console.error(error);
      }
    };
    const fetchData = async () => {
      try {
        const response = await getDrafts();
        if (response) {
          setDrafts(response);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  }, [fetched]);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_ROUTE}/blogs/user/${user?.user_id}`,
          {
            withCredentials: true,
          }
        );
        console.log(res)
        setBlogs(res.data.blogs)
      } catch (error) {
        console.error(error);
      }
    };
    if (!fetchBlogs) {
      getBlogs();
      setFetchBlogs(true);
    }
  }, [blogs, user, fetchBlogs]);

  return (
    <>
      <Navbar />
      {drafts.length > 0 ? <DraftList blogs={drafts} type="drafts" /> : ""}
      {blogs.length > 0 ? <DraftList blogs={blogs} type="blogs"/> : ""}
    </>
  );
};

export default Dashboard;
