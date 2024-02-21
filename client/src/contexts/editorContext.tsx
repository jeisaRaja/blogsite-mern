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
  id?: string;
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

const dummyBlogPost: BlogPost = {
  id: "",
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
  const [blog, setBlog] = useState<BlogPost>(dummyBlogPost);

  const value: BlogState = {
    blog,
    setBlog,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

export default EditorContext;
