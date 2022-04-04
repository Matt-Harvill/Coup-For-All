import { useEffect, useState } from "react";
import AppContext from "./components/AppContext";
import Authorizer from "./components/Authorizer";
import Navbar from "./components/Navbar";
import PageDisplayer from "./components/PageDisplayer";
import PageSelector from "./components/PageSelector";
import { socketInit } from "./socket";

export default function App() {
  const [auth, setAuth] = useState("no auth");
  const [page, setPage] = useState("login");
  const [newPage, setNewPage] = useState("login");
  const [user, setUser] = useState("guest%");

  const state = {
    auth,
    setAuth,
    page,
    setPage,
    newPage,
    setNewPage,
    user,
    setUser,
  };

  useEffect(() => {
    socketInit(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider value={state}>
      <Navbar />
      <PageDisplayer />
      <Authorizer />
    </AppContext.Provider>
  );
}
