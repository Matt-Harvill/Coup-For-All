import { useContext } from "react";
import AppContext from "./AppContext";
import PageSelector from "./PageSelector";
import "../styles/Navbar.css";

export default function Navbar() {
  const { setNewPage } = useContext(AppContext);

  return (
    <div className="navbar">
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
    </div>
  );
}
