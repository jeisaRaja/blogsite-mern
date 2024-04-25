import React, { FC, ReactNode, createContext, useContext, useReducer } from "react";
import { Action } from "./Action";
import { User } from "../common/interfaces";

export type UserState = {
  user_id: string;
  username: string;
  profile_img: string;
  fullname: string;
  email: string;
};

export type AuthFunction = {
  logout: () => void;
  getUserSessionData: () => void;
};


export type Blog = {
  blog_id: string;
  _id: string;
  title: string;
  banner: string;
  content: string;
  tags: Array<string>;
  des: string;
  author: object;
  draft: boolean;
};

export type BlogState = Blog & {
  like: boolean;
};

export type EditorState = Blog & {
  loadDraftClicked: boolean;
};

type AppState = {
  user: UserState | null;
  blog: BlogState | null;
  editor: EditorState | null;
  login: (user: UserState) => void
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "UPDATE_BLOG":
      return { ...state, blog: action.payload };
    case "UPDATE_EDITOR":
      return { ...state, editor: action.payload };
    case "DELETE_BLOG":
      return { ...state, blog: null };
    case "DELETE_EDITOR":
      return { ...state, editor: null };
  }
}

const initialState: AppState = {
  user: null,
  blog: null,
  editor: null,
  login: () =>{return}
}

const useAppState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
};

const AppContext = createContext<AppState>(initialState)

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: FC<AppContextProviderProps> = ({
  children,
}: AppContextProviderProps) => {
  const { state, dispatch } = useAppState()

  const login = (user: UserState) => {
    dispatch({ type: "LOGIN", payload: user })
  }

  return <AppContext.Provider value={{ ...state, login }}>{children}</AppContext.Provider>;
};
