import "../styles/Coup.css";
import unlock from "../images/unlock.png";
import lock from "../images/lock.png";
import { useState } from "react";

export default function CoupCreateGame() {
  const [privacy, setPrivacy] = useState(unlock);
  const [numPlayers, setNumPlayers] = useState("2");

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

  const createGame = () => {};

  return (
    <div className="popUp coupPopUp">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "4fr 32px",
            gap: 10,
            gridAutoRows: "auto",
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
    </div>
  );
}
