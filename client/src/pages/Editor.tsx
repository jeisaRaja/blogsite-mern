import { useState, useEffect, createContext } from "react";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/Blog/BlogEditor";
import { BlogPost, EditorContextProvider } from "../contexts/editorContext";
import { useUserContext } from "../contexts/userContext";

const dummyBlogPost: BlogPost = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  author: {},
};

export const EditorContext = createContext({});

const Editor = () => {
  const [blog, setBlog] = useState(dummyBlogPost);
  const [editorState, setEditorState] = useState("editor");
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();

  useEffect(() => {
    setLoading(false);
  }, [user]);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (!user || !user.access_token) {
    return <Navigate to="/signin" />;
  }

  return (
    <EditorContextProvider>
      {editorState === "editor" ? <BlogEditor /> : <h1>Publish Form</h1>}
    </EditorContextProvider>
  );
};

export default Editor;
