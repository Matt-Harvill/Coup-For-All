import { useContext, useEffect } from "react";
import AppContext from "./AppContext";

export default function Authenticator() {
  const { auth, setAuth, page, setPage } = useContext(AppContext);

  // When auth changes, update pages
  useEffect(() => {
    switch (auth) {
      case "auth":
        changeToAuth();
        break;
      case "no auth":
        changeToNoAuth();
        break;

      default:
        break;
    }
  }, [auth]);

  const switchAuth = () => {
    switch (auth) {
      case "undefined":
        changeToAuth();
        break;
      case "auth":
        changeToNoAuth();
        break;
      case "no auth":
        changeToAuth();
        break;
      default:
        alert("Error with auth states");
        break;
    }
  };

  const changeToAuth = () => {
    setAuth("auth");
    if (page === "login" || page === "register") {
      setPage("home");
    }
  };

  const changeToNoAuth = () => {
    setAuth("no auth");
    setPage("login");
    console.log("changeToNoAuth");
  };

  // return <button onClick={switchAuth}>Switch Auth (Current: {auth})</button>;
}
