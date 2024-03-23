/* eslint-disable react-refresh/only-export-components */
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from "react";

interface ShowBlogState {
  like: boolean;
  setLike: Dispatch<SetStateAction<boolean>>;
}

const BlogContext = createContext<ShowBlogState | undefined>(undefined);

export function useBlogContext(): ShowBlogState {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("context used outside of provider");
  }
  return context;
}

interface BlogContextProviderProps {
  children: ReactNode;
}

export const BlogContextProvider: FC<BlogContextProviderProps> = ({
  children,
}) => {
  const [like, setLike] = useState(false)
  const value: ShowBlogState = {
    like,
    setLike
  };

  return (
    <BlogContext.Provider value={value}>{children}</BlogContext.Provider>
  );
};

export default BlogContext
