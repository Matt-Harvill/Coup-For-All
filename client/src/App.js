import { useEffect, useState } from "react";
import AppContext from "./components/AppContext";
import Authenticator from "./components/Authenticator";
import PageDisplayer from "./components/PageDisplayer";
import PageSelector from "./components/PageSelector";
import { socketInit } from "./socket";

export default function App() {
  const [auth, setAuth] = useState("no auth");
  const [page, setPage] = useState("login");
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState("guest%");

  const state = {
    auth,
    setAuth,
    page,
    setPage,
    chats,
    setChats,
    user,
    setUser,
  };

  useEffect(() => {
    socketInit(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <AppContext.Provider value={state}>
        <p>{`Auth: ${auth}, Page: ${page}`}</p>

        <PageDisplayer style={{ height: 200, width: 200 }} />

        <PageSelector />
        <Authenticator />
      </AppContext.Provider>
    </div>
  );
}
