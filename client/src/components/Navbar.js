import { useContext } from "react";
import AppContext from "./AppContext";
import PageSelector from "./PageSelector";
import "../styles/Navbar.css";
import { allowedPage } from "../pageNavigator";

export default function Navbar() {
  const { page, setPage, auth } = useContext(AppContext);

  const logout = async () => {
    const response = await fetch("/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.status !== 200) {
      alert("Failed to logout");
    }
  };

  return (
    <div className="appNavbar">
      {auth === "no auth" && <span>Game Website</span>}

      {auth === "auth" && (
        <span
          style={{ cursor: "pointer", flex: 1 }}
          onClick={() => {
            setPage(allowedPage(auth, page, "home"));
          }}
        >
          Home
        </span>
      )}

      {/* <PageSelector /> */}

      {auth === "auth" && (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            setPage(allowedPage(auth, page, "coup"));
          }}
        >
          Coup
        </span>
      )}

      {auth === "auth" && (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            setPage(allowedPage(auth, page, "splendor"));
          }}
        >
          Splendor
        </span>
      )}

      {auth === "auth" && <button onClick={logout}>Logout</button>}
    </div>
  );
}
