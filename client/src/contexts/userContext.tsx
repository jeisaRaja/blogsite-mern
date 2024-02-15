import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  FC,
  ReactNode,
} from "react";

interface UserFromServer {
  access_token: string;
  username: string;
  profile_img: string;
  fullname: string;
}

interface UserState {
  user: UserFromServer | null;
  setUser: Dispatch<SetStateAction<UserFromServer | null>>;
}

const UserContext = createContext<UserState | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
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
  const [user, setUser] = React.useState<UserFromServer |null>(null);

  const value: UserState = {
    user,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;


