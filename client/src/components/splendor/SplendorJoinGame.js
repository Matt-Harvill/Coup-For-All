import unlock from "../../images/unlock.png";
import lock from "../../images/lock.png";
import dropdown from "../../images/dropdown.png";
import dropup from "../../images/dropup.png";
import { useContext, useState } from "react";
import SplendorLobbyGamesContext from "./SplendorLobbyGamesContext";
import AppContext from "../AppContext";
import { socket } from "../../socket";

export default function SplendorJoinGame(props) {
  const { inGame } = useContext(SplendorLobbyGamesContext);
  const { userObj } = useContext(AppContext);
  const [extended, setExtended] = useState(false);
  const [inputGameID, setInputGameID] = useState("");
  const game = props.game;
  const privacy = game.privacy;
  const maxPlayers = game.maxPlayers;
  const numPlayers = game.players.length;
  const gameID = game.gameID;

  const inThisGame = game.players.includes(userObj.username);

  const extendTextInput = (boolExtend) => {
    setExtended(boolExtend);
  };

  const handleChange = (e) => {
    setInputGameID(e.target.value);
  };

  const joinGame = () => {
    if (privacy === "public") {
      // Allow joining the game
      socket.emit("splendor", "joinGame", gameID);
    } else if (privacy === "private") {
      if (gameID === inputGameID) {
        // Allow joining the game
        socket.emit("splendor", "joinGame", gameID);
      }
    } else {
      alert("privacy error");
    }

    // Reset inputGameID
    setInputGameID("");
  };

  const displayGameIDForJoin = () => {
    if (inThisGame && privacy === "private") {
      return (
        <div
          style={{
            display: "flex",
            backgroundColor: "#464646",
            color: "white",
            padding: 10,
            gap: 10,
            borderRadius: "0px 0px 10px 10px",
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <div>Game ID:</div>
          <div style={{ border: "1px solid", paddingLeft: 5, paddingRight: 5 }}>
            {gameID}
          </div>
        </div>
      );
    }
  };

  const displayExtension = () => {
    if (extended && !inGame) {
      return (
        <div
          style={{
            display: "flex",
            backgroundColor: "#464646",
            padding: 10,
            gap: 10,
            borderRadius: "0px 0px 10px 10px",
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <input
            placeholder="Enter gameID..."
            style={{ flex: 1, minWidth: 0 }}
            onChange={handleChange}
            value={inputGameID}
          ></input>
          {/* If player doesn't have a game, show the join game button*/}
          <button onClick={joinGame}>Join Game</button>
        </div>
      );
    }
  };

  const displayArrow = () => {
    if (privacy === "private" && !inGame) {
      let srcImg;
      let boolExtend;
      if (extended) {
        srcImg = dropup;
        boolExtend = false;
      } else {
        srcImg = dropdown;
        boolExtend = true;
      }
      return (
        <img
          src={srcImg}
          alt="arrow"
          onClick={() => {
            extendTextInput(boolExtend);
          }}
          style={{ height: 32, width: 32, cursor: "pointer" }}
        ></img>
      );
    }
  };

  const displayPrivacy = () => {
    let imgSrc;
    if (privacy === "public") {
      imgSrc = unlock;
    } else if (privacy === "private") {
      imgSrc = lock;
    } else {
      alert("Error displaying privacy");
    }

    return (
      <img src={imgSrc} alt="privacy" style={{ height: 32, width: 32 }}></img>
    );
  };

  const displayJoinGameButton = () => {
    if (privacy === "public" && !inGame) {
      return <button onClick={joinGame}>Join Game</button>;
    }
  };

  const displayPlayerCount = () => {
    return (
      <div>
        {/* <strong> */}
        {`${numPlayers}/${maxPlayers}`}
        {/* </strong> */}
      </div>
    );
  };

  const displayLoading = () => {
    if (inThisGame) {
      return (
        <div
          className="spinner-border"
          role="status"
          style={{ height: 32, width: 32 }}
        >
          <span className="sr-only"></span>
        </div>
      );
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          backgroundColor: "#0D7377",
          color: "#14FFEC",
          padding: 10,
          gap: 10,
          alignItems: "center",
          borderRadius: 10,
        }}
      >
        <div
          style={{
            wordBreak: "break-word",
            display: "inline",
          }}
        >
          {/* <strong> */}
          {`${game.founder}'s game`}
          {/* </strong> */}
        </div>

        {displayPrivacy()}
        {displayPlayerCount()}
        {/* Adding a gap of flex so button is on other side */}
        <div style={{ flex: 1 }}></div>
        {/* If private game, show dropdown*/}
        {displayArrow()}
        {displayJoinGameButton()}
        {displayLoading()}
      </div>
      {displayGameIDForJoin()}
      {displayExtension()}
    </div>
  );
}
