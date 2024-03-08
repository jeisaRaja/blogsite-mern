import { useUserContext } from "../contexts/userContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

interface RequireAuthProps {
  children: React.ReactNode;
}
export const RequireAuth = ({ children }: RequireAuthProps) => {
  const auth = useUserContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserSessionData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_ROUTE}/session`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          auth.login(response.data);
        }
      } catch (error) {
        console.error("Error fetching user session data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (auth.user === undefined) {
      getUserSessionData();
    } else {
      setLoading(false);
    }
  }, [auth]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return auth.user !== undefined ? children : <Navigate to="/signin" />;
};
