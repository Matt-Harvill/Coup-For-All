import { useContext, useEffect, useState } from "react";
import AppContext from "../components/AppContext";
import CoupActionbar from "../components/CoupActionbar";
import CoupGameContext from "../components/CoupGameContext";
import CoupPlayerCard from "../components/CoupPlayerCard";
import { socket } from "../socket";

export default function CoupGame() {
  const { userObj } = useContext(AppContext);
  const [game, setGame] = useState({});
  const [turn, setTurn] = useState({});

  const gameContext = {
    game: game,
    setGame: setGame,
    turn: turn,
    setTurn: setTurn,
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
          case "updateTurn":
            const turnState = JSON.parse(JSON.stringify(args[0]));
            setTurn(turnState);
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
          <h1 style={{ textAlign: "center", margin: 20 }}>Coup</h1>
          <span>{JSON.stringify(game)}</span>
          {/* <span>{JSON.stringify(turn)}</span> */}
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
            <CoupActionbar />
          </div>
        </CoupGameContext.Provider>
      </div>
    </div>
  );
}
