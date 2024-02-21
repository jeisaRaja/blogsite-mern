import { Navigate } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";
import React, { useEffect } from "react";

interface RequireAuthProps {
  children: React.ReactNode;
}
export const RequireAuth = ({ children }: RequireAuthProps) => {
  const auth = useUserContext();

  useEffect(() => {}, [auth.user]);

  if (auth.user === undefined) {
    console.log(auth.user);
    return <Navigate to="/signin" />;
  }
  return children;
};
