import { useContext, useEffect } from "react";
import AppContext from "./AppContext";
import CoupLobby from "../pages/CoupLobby";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Splendor from "../pages/Splendor";
import CoupGame from "../pages/CoupGame";
import { allowedPage } from "../pageNavigator";

export default function PageDisplayer() {
  const { auth, page, userObj, setPage } = useContext(AppContext);

  const displayPage = () => {
    switch (page) {
      case "login":
        return <Login />;
      case "register":
        return <Register />;
      case "home":
        return <Home />;
      case "coup":
        return <CoupLobby />;
      case "coupGame":
        return <CoupGame />;
      case "splendor":
        return <Splendor />;
      default:
        return <h1>Error with page selection</h1>;
    }
  };

  useEffect(() => {
    if (userObj.gameStatus === "in progress") {
      switch (userObj.gameTitle) {
        case "coup":
          setPage(allowedPage(auth, page, "coupGame"));
          break;

        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userObj.gameStatus]);

  return displayPage();
}
