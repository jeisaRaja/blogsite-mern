import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import EditorPage from "./pages/Editor";
import { UserContextProvider, useUserContext } from "./contexts/userContext";
import { RequireAuth } from "./components/RequireAuth";
import { useEffect } from "react";
import axios from "axios";

function App() {
  return (
    <UserContextProvider>
      <AppComponent />
    </UserContextProvider>
  );
}

function AppComponent() {
  const auth = useUserContext();
  useEffect(() => {
    async function getUserSessionData() {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ROUTE}/session`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        auth.login(response.data);
      }
    }
    if (!auth.user) {
      getUserSessionData();
    }
  }, [auth]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/editor"
          element={
            <RequireAuth>
              <EditorPage />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
