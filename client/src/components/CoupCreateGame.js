import "../styles/Coup.css";
import unlock from "../images/unlock.png";
import lock from "../images/lock.png";
import { useContext } from "react";
import CoupLobbyGamesContext from "./CoupLobbyGamesContext";
import { socket } from "../socket";

export default function CoupCreateGame() {
  const { inGame, ownsGame, privacy, setPrivacy, numPlayers, setNumPlayers } =
    useContext(CoupLobbyGamesContext);

  const changePrivacy = () => {
    switch (privacy) {
      case lock:
        setPrivacy(unlock);
        break;
      case unlock:
        setPrivacy(lock);
        break;
      default:
        alert("error setting privacy");
        break;
    }
  };

  const selectPlayers = (e) => {
    setNumPlayers(e.target.value);
  };

  const createGame = () => {
    let privacyString;
    if (privacy === lock) {
      privacyString = "private";
    } else if (privacy === unlock) {
      privacyString = "public";
    } else {
      alert("error creating game");
      return;
    }
    socket.emit("coup", "createGame", privacyString, numPlayers);
  };

  const deleteGame = () => {
    socket.emit("coup", "deleteGame");
  };

  const leaveGame = () => {
    socket.emit("coup", "leaveGame");
  };

  const showCreateOrDelete = () => {
    if (inGame) {
      if (ownsGame) {
        return (
          <button
            onClick={deleteGame}
            style={{ width: "100%", backgroundColor: "#14FFEC" }}
          >
            Delete Game
          </button>
        );
      } else {
        return (
          <button
            onClick={leaveGame}
            style={{ width: "100%", backgroundColor: "#14FFEC" }}
          >
            Leave Game
          </button>
        );
      }
    } else {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 20,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "4fr 32px",
              gap: 10,
              gridAutoRows: "auto",
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <p readOnly={true}>Number of Players</p>
            <select
              onChange={selectPlayers}
              value={numPlayers}
              style={{ height: 32 }}
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
            <p readOnly={true}>{privacy === unlock ? "Public" : "Private"}</p>
            <img
              onClick={changePrivacy}
              src={privacy}
              alt="privacy"
              style={{ height: 32, width: 32, cursor: "pointer" }}
            ></img>
          </div>
          <button onClick={createGame} style={{ width: "100%" }}>
            Create Game
          </button>
        </div>
      );
    }
  };

  return (
    // <div className="popUp coupPopUp">
    showCreateOrDelete()
  );
}
