import { useContext, useEffect } from "react";
import AppContext from "./AppContext";

export default function PageSwitcher() {
  const { auth, userObj, setNewPage } = useContext(AppContext);

  // When auth/page changes, update pages (if authed for them)
  useEffect(() => {
    switch (auth) {
      case "auth":
        handleAuth();
        break;
      case "no auth":
        handleNoAuth();
        break;
      default:
        alert("Error with auth states");
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  // Switch the page to current game when user enters a game
  useEffect(() => {
    if (userObj.gameStatus === "in progress") {
      switch (userObj.gameTitle) {
        case "coup":
          setNewPage("coupGame");
          break;

        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userObj.gameStatus]);

  const handleAuth = () => {
    setNewPage("home");
  };

  const handleNoAuth = () => {
    setNewPage("login");
  };
}
