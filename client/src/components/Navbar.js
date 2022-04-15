import { useContext } from "react";
import AppContext from "./AppContext";
import PageSelector from "./PageSelector";
import "../styles/Navbar.css";

export default function Navbar() {
  const { setNewPage } = useContext(AppContext);

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
      <span
        style={{ cursor: "pointer", flex: 1 }}
        onClick={() => {
          setNewPage("home");
        }}
      >
        Home
      </span>

      <PageSelector />

      <span
        style={{ cursor: "pointer" }}
        onClick={() => {
          setNewPage("coup");
        }}
      >
        Coup
      </span>

      <span
        style={{ cursor: "pointer" }}
        onClick={() => {
          setNewPage("splendor");
        }}
      >
        Splendor
      </span>

      <span style={{ cursor: "pointer" }} onClick={logout}>
        Logout
      </span>
    </div>
  );
}
