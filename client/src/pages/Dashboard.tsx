import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { BlogPost } from "../contexts/editorContext";
import axios from "axios";
import DraftList from "../components/Blog/DraftList";

const Dashboard = () => {
  const [drafts, setDrafts] = useState<Array<BlogPost>>([]);
  const [fetched, setFetched] = useState(false);
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

  return (
    <>
      <Navbar />
        {drafts.length > 0 ? <DraftList drafts={drafts} /> : ""}
        <div>Your Blogs</div>
    </>
  );
};

export default Dashboard;
