import { useContext, useEffect } from "react";
import AppContext from "./AppContext";

export default function Authorizer() {
  const { auth, page, setPage, newPage, setNewPage } = useContext(AppContext);

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

  // When newPage is requested, update pages (if authed for them)
  useEffect(() => {
    switch (auth) {
      case "auth":
        handleNewPageAuth();
        break;
      case "no auth":
        handleNewPageNoAuth();
        break;
      default:
        alert("Error with auth states");
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPage]);

  const handleNewPageAuth = () => {
    if (newPage !== "login" && newPage !== "register") {
      setPage(newPage);
    } else {
      setNewPage(page); // Reset newPage if no change
    }
  };

  const handleNewPageNoAuth = () => {
    if (newPage === "login" || newPage === "register") {
      setPage(newPage);
    } else {
      setNewPage(page); // Reset newPage if no change
    }
  };
}
