import { useContext, useEffect, useState } from "react";
import AppContext from "../components/AppContext";
import SplendorActiveCard from "../components/splendor/SplendorActiveCard";
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

  let allActiveCards;
  if (game && game.activeCards) {
    const level1cards = game.activeCards.level1;
    const level2cards = game.activeCards.level2;
    const level3cards = game.activeCards.level3;
    if (level1cards.length < 4) {
      level1cards.splice(level1cards.length - 1, 0, null);
    }
    if (level2cards.length < 4) {
      level2cards.splice(level2cards.length - 1, 0, null);
    }
    if (level3cards.length < 4) {
      level3cards.splice(level3cards.length - 1, 0, null);
    }
    allActiveCards = level3cards.concat(level2cards.concat(level1cards));
  }

  const displayActiveCard = (card) => {
    return <SplendorActiveCard card={card} />;
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
          {/* <pre style={{ color: "black" }}>
            Game: {JSON.stringify(game, null, "\t")}
          </pre> */}
          {/* <span>{JSON.stringify(turn)}</span> */}
          <div
            style={{
              marginLeft: 20,
              marginRight: 20,
              padding: 20,
              display: "grid",
              gap: 20,
              gridTemplateColumns: "repeat(4, 1fr)",
              backgroundColor: "#464646",
            }}
          >
            {allActiveCards && allActiveCards.map(displayActiveCard)}
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
