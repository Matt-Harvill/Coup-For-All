import { useContext, useEffect, useState } from "react";
import AppContext from "../components/AppContext";
import CoupActionbar from "../components/CoupActionbar";
import CoupGameContext from "../components/CoupGameContext";
import CoupPlayerCard from "../components/CoupPlayerCard";
import { socket } from "../socket";

export default function CoupGame() {
  const { userObj } = useContext(AppContext);
  const [game, setGame] = useState({});

  // Turn Info
  const [activePlayer, setActivePlayer] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [inCalloutPeriod, setInCalloutPeriod] = useState(false);
  const [deciding, setDeciding] = useState([]);

  const turnInfo = {
    activePlayer: activePlayer,
    setActivePlayer: setActivePlayer,
    timeLeft: timeLeft,
    setTimeLeft: setTimeLeft,
    inCalloutPeriod: inCalloutPeriod,
    setInCalloutPeriod: setInCalloutPeriod,
    deciding: deciding,
    setDeciding: setDeciding,
  };

  const gameContext = {
    game: game,
    setGame: setGame,
    turnInfo: turnInfo,
  };

  const coupCardWidth = 200;

  // Setup coup socket listener
  useEffect(() => {
    socket.on("coup", (event, gameID, ...args) => {
      if (gameID === userObj.gameID) {
        switch (event) {
          case "updateGame":
            const gameState = args[0];
            setGame(gameState);
            break;
          case "timeInTurn":
            const [activePlayer, timeLeft] = args;
            setActivePlayer(activePlayer);
            setTimeLeft(timeLeft);
            setInCalloutPeriod(false);
            setDeciding([]);
            break;
          case "timeInCallout":
            const [needToDecide, target, calloutTime] = args;
            setActivePlayer(target);
            setTimeLeft(calloutTime);
            setInCalloutPeriod(true);
            setDeciding(needToDecide);
            break;
          case "calloutReceived":
            const [needToDecide_] = args;
            setDeciding(needToDecide_);
            break;
          default:
            break;
        }
      }
    });

    socket.emit("coup", "getGameState");
    return () => {
      socket.off("coup"); // remove coup online listener
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayPlayer = (pStat) => {
    return <CoupPlayerCard width={coupCardWidth} pStat={pStat} />;
  };

  return (
    <div className="page">
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <CoupGameContext.Provider value={gameContext}>
          <h1 style={{ textAlign: "center", margin: 20 }}>CoupGame</h1>
          {/* <span>{JSON.stringify(game)}</span> */}
          <div
            style={{
              display: "grid",
              gap: 20,
              gridTemplateColumns: `repeat(auto-fit, ${coupCardWidth}px)`,
              justifyContent: "space-evenly",
              padding: 20,
            }}
          >
            {game.pStats && game.pStats.map(displayPlayer)}
          </div>
          {/* Add flex 1 object to move actionbar to the bottom */}
          <div style={{ flex: 1 }}></div>
          <div>
            <CoupActionbar timeLeft={turnInfo.timeLeft} />
          </div>
        </CoupGameContext.Provider>
      </div>
    </div>
  );
}
