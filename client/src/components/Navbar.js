import { useContext } from "react";
import AppContext from "./AppContext";
import "../styles/Navbar.css";
import { socket } from "../socket";

export default function Navbar() {
  const { setNewPage, auth, userObj } = useContext(AppContext);

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
    socket.emit("leaveGame", userObj.gameTitle);
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

      {userObj.gameStatus === "in progress" && (
        <button onClick={leaveGame} style={{ backgroundColor: "#FF5A5A" }}>
          Leave Game
        </button>
      )}

      {auth === "auth" && <button onClick={logout}>Logout</button>}
    </div>
  );
}
