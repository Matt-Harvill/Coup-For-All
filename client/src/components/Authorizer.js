import { useContext, useEffect } from "react";
import AppContext from "./AppContext";

export default function Authorizer() {
  const { auth, page, setPage } = useContext(AppContext);

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

  const handleAuth = () => {
    if (page === "login" || page === "register") {
      setPage("home");
    }
  };

  const handleNoAuth = () => {
    if (page !== "register") {
      setPage("login");
    }
  };
}
