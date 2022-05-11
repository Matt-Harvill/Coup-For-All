import { useContext } from "react";
import { socket } from "../socket";
import AppContext from "./AppContext";
import CoupGameContext from "./CoupGameContext";
import TimeLeft from "./TimeLeft";

export default function CoupActionbar() {
  const { turnInfo } = useContext(CoupGameContext);
  const { userObj } = useContext(AppContext);
  const timeLeft = turnInfo.timeLeft;

  const maxTimeLeft = 60;

  const displayButtons = () => {
    if (turnInfo.inCalloutPeriod) {
      // Don't display callout buttons if user is the one being tested
      if (turnInfo.activePlayer === userObj.username) {
        return <div></div>;
      }
      // If user is not being called out, let them call out or pass
      else {
        return (
          <div
            style={{
              margin: "auto",
              width: "50%",
              display: "grid",
              gridGap: 20,
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            }}
          >
            <button>Pass</button>
            <button>Call Out</button>
          </div>
        );
      }
    }
    // If not callout period, check if active player is this user
    else if (turnInfo.activePlayer === userObj.username) {
      return (
        <div
          style={{
            margin: "auto",
            width: "50%",
            display: "grid",
            gridGap: 20,
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          }}
        >
          <button onClick={endTurn}>End Turn</button>
          <button onClick={action}>Action</button>
        </div>
      );
    }
  };

  const endTurn = () => {
    socket.emit("coup", "endTurn");
  };

  const action = () => {
    socket.emit("coup", "action", "defaultAction", "defaultTarget");
  };

  return (
    <div
      style={{
        minHeight: 100,
        width: "100%",
        backgroundColor: "#c4c4c4",
        padding: 10,
      }}
    >
      <TimeLeft timeLeft={timeLeft} maxTimeLeft={maxTimeLeft} />
      <div style={{ height: 10 }}></div>
      {displayButtons()}
    </div>
  );
}
