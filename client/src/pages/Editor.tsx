import { useState, useEffect, createContext } from "react";
import BlogEditor from "../components/Blog/BlogEditor";
import {
  BlogPost,
  EditorContextProvider,
  useEditorContext,
} from "../contexts/editorContext";
import { useUserContext } from "../contexts/userContext";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";
import DraftList from "../components/Blog/DraftList";

export const EditorContext = createContext({});

const Editor = () => {
  const auth = useUserContext();
  const [drafts, setDrafts] = useState<Array<BlogPost>>([]);
  const [fetched, setFetched] = useState(false);
  const [draftsUpdated, setDraftsUpdated] = useState(false);

  useEffect(() => {
    const getDrafts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_ROUTE}/editor/draft`,
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
    if (!fetched || draftsUpdated) {
      fetchData();
      setFetched(true);
      setDraftsUpdated(false);
    }
  }, [fetched, draftsUpdated, auth.user]);

  return (
    <EditorContextProvider>
      <Navbar />
      {drafts.length > 0 ? <DraftList drafts={drafts} /> : ""}
      <BlogEditor setDraftsUpdated={setDraftsUpdated} />
    </EditorContextProvider>
  );
};

export default Editor;
