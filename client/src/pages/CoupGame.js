import { useContext, useEffect, useState } from "react";
import AppContext from "../components/AppContext";
import CoupGameContext from "../components/CoupGameContext";
import CoupPlayerCard from "../components/CoupPlayerCard";
import { socket } from "../socket";

export default function CoupGame() {
  const { userObj } = useContext(AppContext);
  const [game, setGame] = useState({});
  const [turnInfo, setTurnInfo] = useState({
    activePlayer: "",
    timeLeft: null,
  });

  const gameContext = {
    game: game,
    setGame: setGame,
    turnInfo: turnInfo,
    setTurnInfo: setTurnInfo,
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
            setTurnInfo({
              activePlayer: activePlayer,
              timeLeft: timeLeft,
            });
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
    if (pStat.player === turnInfo.activePlayer) {
      return (
        <CoupPlayerCard
          width={coupCardWidth}
          pStat={pStat}
          timeLeft={turnInfo.timeLeft}
        />
      );
    } else {
      return (
        <CoupPlayerCard width={coupCardWidth} pStat={pStat} timeLeft={null} />
      );
    }
  };

  return (
    <div className="page">
      <CoupGameContext.Provider value={gameContext}>
        <h1 style={{ textAlign: "center", margin: 20 }}>CoupGame</h1>
        {/* <span>{JSON.stringify(game)}</span> */}
        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: `repeat(auto-fit, ${coupCardWidth}px)`,
            justifyContent: "space-evenly",
          }}
        >
          {game.pStats && game.pStats.map(displayPlayer)}
        </div>
      </CoupGameContext.Provider>
    </div>
  );
}
