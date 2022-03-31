import { useContext } from "react";
import AppContext from "./AppContext";

export default function PageSelector() {
  const { page, setPage, auth } = useContext(AppContext);

  const selectPage = (e) => {
    let newPage = e.target.value;

    if (auth === "no auth") {
      if (newPage === "register") {
        setPage("register");
      } else {
        setPage("login");
        if (newPage !== "login") {
          alert("not authed for that page");
        }
      }
    }
    //
    else if (auth === "auth") {
      if (newPage !== "login" && newPage !== "register") {
        setPage(newPage);
      } else {
        setPage("home");
      }
    }
    //
    else if (auth === "undefined") {
      setPage("login");
    }
    //
    else {
      alert("auth state error");
      setPage("login");
    }
  };

  return (
    <div>
      <p>Select Page</p>
      <select onChange={selectPage} value={page}>
        {auth === "no auth" && <option value="login">login</option>}
        {auth === "no auth" && <option value="register">register</option>}
        {auth === "auth" && <option value="home">home</option>}
        {auth === "auth" && <option value="coup">coup</option>}
        {auth === "auth" && <option value="splendor">splendor</option>}
      </select>
    </div>
  );
}
