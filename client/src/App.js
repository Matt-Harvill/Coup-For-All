import { useEffect, useState } from "react";
import AppContext from "./components/AppContext";
import Authenticator from "./components/Authenticator";
import PageDisplayer from "./components/PageDisplayer";
import PageSelector from "./components/PageSelector";
import { socketInit } from "./socket";

function App() {
  const [auth, setAuth] = useState("undefined");
  const [page, setPage] = useState("home");
  const [chats, setChats] = useState([]);

  const state = { auth, setAuth, page, setPage, chats, setChats };

  useEffect(() => {
    socketInit(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <AppContext.Provider value={state}>
        <p>{`Auth: ${auth}`}</p>
        <p>{`Page: ${page}`}</p>

        <PageDisplayer style={{ height: 200, width: 200 }} />

        <PageSelector />
        <Authenticator />
      </AppContext.Provider>
    </div>
  );
}

export default App;
