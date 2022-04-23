import { useEffect, useState } from "react";
import AppContext from "./components/AppContext";
import PageSwitcher from "./components/PageSwitcher";
import Navbar from "./components/Navbar";
import PageDisplayer from "./components/PageDisplayer";
import UserObjUpdater from "./components/UserObjUpdater";
import { socketInit } from "./socket";

export default function App() {
  const [auth, setAuth] = useState("no auth");
  const [page, setPage] = useState("login");
  const [user, setUser] = useState("guest%");
  const [userObj, setUserObj] = useState({
    username: "",
    gameTitle: "",
    gameID: "",
    gameStatus: "",
    pStat: {},
  });

  const state = {
    auth,
    setAuth,
    page,
    setPage,
    user,
    setUser,
    userObj,
    setUserObj,
  };

  useEffect(() => {
    socketInit(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider value={state}>
      {JSON.stringify(userObj)}
      {/* <p>{`newPage: ${newPage}, page ${page}`}</p> */}
      <Navbar />
      <PageDisplayer />
      <PageSwitcher />
      <UserObjUpdater />
    </AppContext.Provider>
  );
}
