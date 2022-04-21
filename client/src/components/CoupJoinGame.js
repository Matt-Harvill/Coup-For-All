import unlock from "../images/unlock.png";
import lock from "../images/lock.png";
import dropdown from "../images/dropdown.png";
import dropup from "../images/dropup.png";
import { useContext, useState } from "react";
import CoupGameContext from "./CoupGameContext";

export default function CoupJoinGame(props) {
  const { hasGame } = useContext(CoupGameContext);
  const [extended, setExtended] = useState(false);
  const game = props.game;
  const privacy = game.privacy;

  const extendTextInput = (boolExtend) => {
    setExtended(boolExtend);
  };

  const displayExtension = () => {
    if (extended && !hasGame) {
      return (
        <div
          style={{
            display: "flex",
            backgroundColor: "#c4c4c4",
            padding: 10,
            gap: 10,
            alignItems: "center",
            // borderRadius: 10,
          }}
        >
          {/* Adding a gap of flex so button is on other side */}
          <input
            placeholder="Enter gameID..."
            style={{ flex: 1, minWidth: 0 }}
          ></input>
          {/* If player doesn't have a game, show the join game button*/}
          <button>Join Game</button>
        </div>
      );
    }
  };

  const displayArrow = () => {
    if (privacy === "private" && !hasGame) {
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
    if (privacy === "public" && !hasGame) {
      return <button>Join Game</button>;
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          backgroundColor: "#c4c4c4",
          padding: 10,
          gap: 10,
          alignItems: "center",
          // borderRadius: 10,
        }}
      >
        <div
          style={{
            wordBreak: "break-word",
            display: "inline",
          }}
        >
          <strong>{`${game.founder}'s game`}</strong>
        </div>

        {displayPrivacy()}
        {/* Adding a gap of flex so button is on other side */}
        <div style={{ flex: 1 }}></div>
        {/* If private game, show dropdown*/}
        {displayArrow()}
        {displayJoinGameButton()}
      </div>
      {displayExtension()}
    </div>
  );
}
