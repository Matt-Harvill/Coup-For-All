import { useContext, useEffect, useState } from "react";
import { longTurnTime, shortTurnTime } from "../../coupTurnTimes";
import { socket } from "../../socket";
import AppContext from "../AppContext";
import TimeLeft from "../TimeLeft";
import SplendorGameContext from "./SplendorGameContext";

export default function SplendorActionbar() {
  const { game } = useContext(SplendorGameContext);
  const { userObj } = useContext(AppContext);
  // const [maxTimeRem, setMaxTimeRem] = useState(longTurnTime);
  // const timeRem = turn.timeRemMS;

  if (game.winner) {
    let name;
    if (userObj.username === game.winner) {
      name = "You";
    } else {
      name = game.winner;
    }

    return (
      <div
        style={{
          minHeight: 100,

          width: "100%",
          backgroundColor: "#464646",
          padding: 10,
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
          borderRadius: 0,
        }}
      >
        <div></div>
        <h4 style={{ textAlign: "center" }}>{`${name} Won!`}</h4>
      </div>
    );
  } else {
    return (
      <div
        style={{
          minHeight: 100,
          width: "100%",
          backgroundColor: "#464646",
          padding: 10,
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
          borderRadius: 0,
        }}
      >
        <div></div>
        <div>
          <h4 style={{ textAlign: "center" }}>Splendor Actionbar</h4>
        </div>
      </div>
    );
  }
}
