import { useContext } from "react";
import { socket } from "../socket";
import AppContext from "./AppContext";
import CoupGameContext from "./CoupGameContext";

export default function CoupPlayerCard(props) {
  const { turnInfo } = useContext(CoupGameContext);
  const { userObj } = useContext(AppContext);
  const pStat = props.pStat;
  const timeLeft = props.timeLeft;
  const width = props.width;

  const maxTimeLeft = 10;

  const displayEndTurnButton = () => {
    // If this is the user, this is their player card, and its their turn -> show end turn button
    if (
      turnInfo.activePlayer === pStat.player &&
      pStat.player === userObj.username
    ) {
      return <button onClick={endTurn}>End Turn</button>;
    }
  };

  const displayTimeLeft = () => {
    if (timeLeft) {
      let timeLeftColor;
      if (timeLeft <= maxTimeLeft * 0.2) {
        timeLeftColor = "red";
      } else if (timeLeft <= maxTimeLeft * 0.4) {
        timeLeftColor = "orange";
      } else if (timeLeft <= maxTimeLeft) {
        timeLeftColor = "green";
      }

      return (
        <div>
          <p>Turn Time Remaining:</p>
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuenow={timeLeft.toString()}
              aria-valuemin="0"
              aria-valuemax={maxTimeLeft.toString()}
              style={{
                width: `${(1 - timeLeft / maxTimeLeft) * 100}%`,
                backgroundColor: timeLeftColor,
              }}
            ></div>
          </div>
          <div style={{ height: 10 }}></div>
          {displayEndTurnButton()}
        </div>
      );
    }
  };

  const endTurn = () => {
    socket.emit("coup", "endTurn");
  };

  return (
    <div
      style={{
        minHeight: 100,
        width: width,
        backgroundColor: "#c4c4c4",
        padding: 10,
      }}
    >
      <p>
        <strong>{pStat.player}</strong>
      </p>
      <p>Coins: {pStat.coins}</p>
      <p>Roles: {pStat.roles.join(", ")}</p>
      {displayTimeLeft()}
    </div>
  );
}
