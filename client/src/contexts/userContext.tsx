/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import React, { createContext, useContext, FC, ReactNode } from "react";

export interface UserFromServer {
  user_id: string;
  username: string;
  profile_img: string;
  fullname: string;
  email: string;
}

interface UserState {
  user: UserFromServer | undefined;
  login: (user: UserFromServer) => void;
  logout: () => void;
  getUserSessionData: () => void;
}

const UserContext = createContext<UserState | undefined>(undefined);

export const useUserContext = (): UserState => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider: FC<UserContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = React.useState<UserFromServer | undefined>(undefined);
  const login = (user: UserFromServer) => {
    setUser(user);
  };
  const logout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ROUTE}/signout`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setUser(undefined);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  async function getUserSessionData() {
    const response = await axios.get(
      `${import.meta.env.VITE_API_ROUTE}/session`,
      {
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      setUser(response.data);
    }
  }
  if (!user) {
    getUserSessionData();
  }

  const value: UserState = {
    user,
    login,
    logout,
    getUserSessionData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
