import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../contexts/useAppContext";

interface RequireAuthProps {
  children: React.ReactNode;
}
export const RequireAuth = ({ children }: RequireAuthProps) => {
  const {user,login} = useAppContext()
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
          login(response.data);
        }
      } catch (error) {
        console.error("Error fetching user session data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user === undefined) {
      getUserSessionData();
    } else {
      setLoading(false);
    }
  }, [user,login]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return user !== undefined ? children : <Navigate to="/signin" />;
};
