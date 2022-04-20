import { useEffect, useState } from "react";
import AppContext from "./components/AppContext";
import AuthPageSwitcher from "./components/AuthPageSwitcher";
import Navbar from "./components/Navbar";
import PageDisplayer from "./components/PageDisplayer";
import { socketInit } from "./socket";

export default function App() {
  const [auth, setAuth] = useState("no auth");
  const [page, setPage] = useState("login");
  const [user, setUser] = useState("guest%");

  const state = {
    auth,
    setAuth,
    page,
    setPage,
    user,
    setUser,
  };

  useEffect(() => {
    socketInit(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider value={state}>
      {/* <p>{`newPage: ${newPage}, page ${page}`}</p> */}
      <Navbar />
      <PageDisplayer />
      <AuthPageSwitcher />
    </AppContext.Provider>
  );
}
