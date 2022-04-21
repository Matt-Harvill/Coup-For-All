import unlock from "../images/unlock.png";
import lock from "../images/lock.png";
import { useContext } from "react";
import CoupGameContext from "./CoupGameContext";

export default function CoupJoinGame(props) {
  const { hasGame, setHasGame } = useContext(CoupGameContext);
  const game = props.game;

  const displayPrivacy = () => {
    let privacy;
    if (game.privacy === "public") {
      privacy = unlock;
    } else {
      privacy = lock;
    }
    return (
      <img src={privacy} alt="privacy" style={{ height: 32, width: 32 }}></img>
    );
  };

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
      {/* If player doesn't have a game, show the join game button*/}
      {!hasGame && <button>Join Game</button>}
    </div>
  );
}
