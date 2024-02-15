import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { lookInSession } from "./common/session";
import EditorPage from "./pages/Editor";
import { UserContextProvider, useUserContext } from "./contexts/userContext";

function App() {
  return (
    <UserContextProvider>
      <AppComponent />
    </UserContextProvider>
  );
}

function AppComponent() {
  const { setUser } = useUserContext();
  useEffect(() => {
    const userFromSession = lookInSession("user") as string;
    userFromSession
      ? setUser(JSON.parse(userFromSession))
      : setUser((prevUser) => ({
          ...prevUser,
          access_token: "",
          username: prevUser?.username || "",
          profile_img: prevUser?.profile_img || "",
          fullname: prevUser?.fullname || "",
        }));
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
