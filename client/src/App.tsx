import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import EditorPage from "./pages/Editor";
import { UserContextProvider, useUserContext } from "./contexts/userContext";
import { RequireAuth } from "./components/RequireAuth";
import { useEffect } from "react";
import axios from "axios";
import Dashboard from "./pages/Dashboard";
import { EditorContextProvider } from "./contexts/editorContext";
import BlogPage from "./pages/BlogPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <UserContextProvider>
      <EditorContextProvider>
        <AppComponent />
      </EditorContextProvider>
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
          path="/editor/:blogId"
          element={
            <RequireAuth>
              <EditorPage />
            </RequireAuth>
          }
        />
        <Route
          path="/editor"
          element={
            <RequireAuth>
              <EditorPage />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route path="/blog/:blogId" element={<BlogPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
