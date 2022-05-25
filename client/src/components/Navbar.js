import { useContext, useState } from "react";
import AppContext from "./AppContext";
import "../styles/Navbar.css";
import { socket } from "../socket";

export default function Navbar() {
  const { setNewPage, auth, userObj } = useContext(AppContext);
  const [gamesLinkColor, setGamesLinkColor] = useState("black");
  const [coupLinkColor, setCoupLinkColor] = useState("black");
  const [splendorLinkColor, setSplendorLinkColor] = useState("black");

  const logout = async () => {
    const response = await fetch("/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.status !== 200) {
      alert("Failed to logout");
    }
  };

  const leaveGame = () => {
    socket.emit(userObj.gameTitle, "leaveGame");
  };

  return (
    <div className="appNavbar">
      {auth === "no auth" && <span>Game Website</span>}

      {auth === "auth" && (
        <span
          style={{ cursor: "pointer", color: gamesLinkColor }}
          onClick={() => {
            setNewPage("games");
          }}
          onMouseEnter={() => setGamesLinkColor("white")}
          onMouseLeave={() => setGamesLinkColor("black")}
        >
          Games
        </span>
      )}

      <div style={{ flex: 1 }}></div>

      {auth === "auth" && (
        <span
          style={{ cursor: "pointer", color: coupLinkColor }}
          onClick={() => {
            setNewPage("coup");
          }}
          onMouseEnter={() => setCoupLinkColor("white")}
          onMouseLeave={() => setCoupLinkColor("black")}
        >
          Coup Lobby
        </span>
      )}

      {/* {auth === "auth" && (
        <span
          style={{ cursor: "pointer", color: splendorLinkColor }}
          onClick={() => {
            setNewPage("splendor");
          }}
          onMouseEnter={() => setSplendorLinkColor("white")}
          onMouseLeave={() => setSplendorLinkColor("black")}
        >
          Splendor
        </span>
      )} */}

      {userObj.gameStatus === "in progress" && (
        <button onClick={leaveGame} style={{ backgroundColor: "#FF5A5A" }}>
          Leave Game
        </button>
      )}

      {auth === "auth" && <button onClick={logout}>Logout</button>}
    </div>
  );
}
