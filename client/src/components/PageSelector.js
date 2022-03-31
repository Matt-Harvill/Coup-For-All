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
        <option value="login">login</option>
        <option value="register">register</option>
        <option value="home">home</option>
        <option value="coup">coup</option>
        <option value="splendor">splendor</option>
      </select>
    </div>
  );
}
