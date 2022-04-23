import { useContext } from "react";
import AppContext from "./AppContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { setNewPage, auth } = useContext(AppContext);

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
            setNewPage("home");
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
            setNewPage("coupGame");
          }}
        >
          CoupGame (temp)
        </span>
      )}

      {auth === "auth" && (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            setNewPage("coup");
          }}
        >
          Coup
        </span>
      )}

      {auth === "auth" && (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            setNewPage("splendor");
          }}
        >
          Splendor
        </span>
      )}

      {auth === "auth" && <button onClick={logout}>Logout</button>}
    </div>
  );
}
