import { useContext, useEffect, useState } from "react";
import AppContext from "../components/AppContext";
// import SplendorActionbar from "../components/splendor/SplendorActionbar";
import SplendorGameContext from "../components/splendor/SplendorGameContext";
// import SplendorPlayerCard from "../components/splendor/SplendorPlayerCard";
import { socket } from "../socket";

export default function SplendorGame() {
  const { userObj } = useContext(AppContext);
  const [game, setGame] = useState({});
  const [turn, setTurn] = useState({});

  const gameContext = {
    game: game,
    setGame: setGame,
    turn: turn,
    setTurn: setTurn,
  };

  const splendorCardWidth = 240;

  // Setup splendor socket listener
  useEffect(() => {
    socket.on("splendor", (event, gameID, ...args) => {
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

    socket.emit("splendor", "getGameState");
    return () => {
      socket.off("splendor"); // remove splendor online listener
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayPlayer = (pStat) => {
    return <div>{JSON.stringify(pStat)}</div>;
    // return <SplendorPlayerCard width={splendorCardWidth} pStat={pStat} />;
  };

  return (
    <div className="page splendorPage">
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <SplendorGameContext.Provider value={gameContext}>
          <h1
            style={{ textAlign: "center", paddingTop: 20, paddingBottom: 20 }}
          >
            Splendor
          </h1>
          <pre style={{ color: "black" }}>
            Game: {JSON.stringify(game, null, "\t")}
          </pre>
          {/* <span>{JSON.stringify(turn)}</span> */}
          <div
            style={{
              display: "grid",
              gap: 20,
              gridTemplateColumns: `repeat(auto-fit, ${splendorCardWidth}px)`,
              justifyContent: "space-evenly",
              padding: 20,
            }}
          >
            {game.pStats && game.pStats.map(displayPlayer)}
          </div>
          {/* Add flex 1 object to move actionbar to the bottom */}
          <div style={{ flex: 1 }}></div>
          {/* <div>
            <SplendorActionbar />
          </div> */}
        </SplendorGameContext.Provider>
      </div>
    </div>
  );
}
