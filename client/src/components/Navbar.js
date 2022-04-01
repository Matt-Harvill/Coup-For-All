import { useContext } from "react";
import AppContext from "./AppContext";
import PageSelector from "./PageSelector";
import "../styles/Navbar.css";

export default function Navbar() {
  const { setNewPage } = useContext(AppContext);

  return (
    <div className="navbar">
      <p
        style={{
          textDecoration: "underline",
          cursor: "pointer",
          display: "block",
          flex: 1,
        }}
        onClick={() => {
          setNewPage("home");
        }}
      >
        Home
      </p>

      <PageSelector />

      <p
        style={{
          textDecoration: "underline",
          cursor: "pointer",
        }}
        onClick={() => {
          setNewPage("coup");
        }}
      >
        Coup
      </p>

      <p
        style={{
          textDecoration: "underline",
          cursor: "pointer",
        }}
        onClick={() => {
          setNewPage("splendor");
        }}
      >
        Splendor
      </p>
    </div>
  );
}
