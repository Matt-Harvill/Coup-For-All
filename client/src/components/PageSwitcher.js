import { useContext, useEffect } from "react";
import AppContext from "./AppContext";

export default function PageSwitcher() {
  const { auth, page, userObj, setNewPage } = useContext(AppContext);

  // When auth/page changes, update pages (if authed for them)
  useEffect(() => {
    switch (auth) {
      case "auth":
        setNewPage("games");
        break;
      case "no auth":
        setNewPage("login");
        break;
      default:
        alert("Error with auth states");
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  // Switch the page to current game when user enters a game
  useEffect(() => {
    switch (userObj.gameStatus) {
      case "in progress":
        switch (userObj.gameTitle) {
          case "coup":
            setNewPage("coupGame");
            break;

          default:
            break;
        }
        break;
      case "":
        switch (page) {
          case "coup":
          case "coupGame":
            setNewPage("coup");
            break;
          default:
            setNewPage("games");
        }
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userObj.gameStatus]);
}
