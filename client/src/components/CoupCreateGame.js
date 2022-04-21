import "../styles/Coup.css";
import unlock from "../images/unlock.png";
import lock from "../images/lock.png";
import { useContext } from "react";
import CoupGameContext from "./CoupGameContext";
import { socket } from "../socket";

export default function CoupCreateGame() {
  const { hasGame, privacy, setPrivacy, numPlayers, setNumPlayers } =
    useContext(CoupGameContext);

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

    socket.emit("coup createGame", privacyString);
  };

  const deleteGame = () => {
    socket.emit("coup deleteGame");
  };

  const showCreateOrDelete = () => {
    if (hasGame) {
      return (
        <button
          onClick={deleteGame}
          style={{ width: "100%", backgroundColor: "#FF5A5A" }}
        >
          Delete Game
        </button>
      );
    } else {
      return (
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
      );
    }
  };

  return (
    // <div className="popUp coupPopUp">
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: 20,
        width: "100%",
      }}
    >
      {showCreateOrDelete()}

      <button onClick={createGame} style={{ width: "100%" }}>
        Create Game
      </button>
    </div>
    // </div>
  );
}
