/* eslint-disable react-refresh/only-export-components */
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export interface BlogPost {
  blog_id?: string;
  _id?: string;
  title: string;
  banner: string;
  content: string;
  tags: Array<string>;
  des: string;
  author: object;
  draft: boolean;
}

export interface BlogState {
  blog: BlogPost;
  setBlog: Dispatch<SetStateAction<BlogPost>>;
  loadDraftClicked: boolean;
  setLoadDraftClicked: Dispatch<SetStateAction<boolean>>;
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
}

export const EditorContext = createContext<BlogState | undefined>(undefined);

export function useEditorContext(): BlogState {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("context used outside of provider");
  }
  return context;
}

interface EditorContextProviderProps {
  children: ReactNode;
}

export const dummyBlogPost: BlogPost = {
  blog_id: "",
  _id: "",
  title: "",
  banner: "",
  content: "",
  tags: [],
  des: "",
  author: {},
  draft: true,
};

export const EditorContextProvider: FC<EditorContextProviderProps> = ({
  children,
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [blog, setBlog] = useState<BlogPost>(dummyBlogPost);
  const [loadDraftClicked, setLoadDraftClicked] = useState(false);
  const value: BlogState = {
    blog,
    setBlog,
    loadDraftClicked,
    setLoadDraftClicked,
    tags,
    setTags,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

export default EditorContext;
