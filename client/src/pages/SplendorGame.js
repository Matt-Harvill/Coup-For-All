import { useContext, useEffect, useState } from "react";
import AppContext from "../components/AppContext";
import SplendorActiveCard from "../components/splendor/SplendorActiveCard";
// import SplendorActionbar from "../components/splendor/SplendorActionbar";
import SplendorGameContext from "../components/splendor/SplendorGameContext";
import SplendorInactiveCard from "../components/splendor/SplendorInactiveCard";
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

  let allActiveCards, level1cards, level2cards, level3cards;
  let inactiveLevel1cards, inactiveLevel2cards, inactiveLevel3cards;
  let maxCardHeight = 80;
  if (game && game.activeCards) {
    level1cards = game.activeCards.level1;
    level2cards = game.activeCards.level2;
    level3cards = game.activeCards.level3;
    inactiveLevel1cards = game.inactiveCards.level1;
    inactiveLevel2cards = game.inactiveCards.level2;
    inactiveLevel3cards = game.inactiveCards.level3;
    if (level1cards.length < 4) {
      level1cards.splice(level1cards.length - 1, 0, null);
    }
    if (level2cards.length < 4) {
      level2cards.splice(level2cards.length - 1, 0, null);
    }
    if (level3cards.length < 4) {
      level3cards.splice(level3cards.length - 1, 0, null);
    }
    allActiveCards = level1cards.concat(level2cards.concat(level3cards));
    for (const card of allActiveCards) {
      let numRequirements = 0;
      for (const [key, value] of Object.entries(card.requirements)) {
        if (value > 0) {
          numRequirements++;
        }
      }
      if (numRequirements > 2) {
        maxCardHeight = 100;
        break;
      }
    }
  }

  const displayActiveCard = (card) => {
    return <SplendorActiveCard card={card} maxHeight={maxCardHeight} />;
  };

  const displayInActiveCard = (level) => {
    return <SplendorInactiveCard level={level} maxHeight={maxCardHeight} />;
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
              marginBottom: 20,
              padding: 20,
              display: "grid",
              gap: 20,
              // gridTemplateColumns: "repeat(auto-fit, minmax(62px,1fr))",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px,1fr))",
              backgroundColor: "#464646",
            }}
          >
            {level3cards && (
              <div
                style={{
                  backgroundColor: "#f4deff",
                  padding: 10,
                  display: "grid",
                  gap: 10,
                  gridTemplateColumns: "repeat(auto-fit, minmax(62px,1fr))",
                }}
              >
                {inactiveLevel3cards && displayInActiveCard(3)}
                {level3cards.map(displayActiveCard)}
              </div>
            )}
            {level2cards && (
              <div
                style={{
                  backgroundColor: "#f4deff",
                  padding: 10,
                  display: "grid",
                  gap: 10,
                  gridTemplateColumns: "repeat(auto-fit, minmax(62px,1fr))",
                }}
              >
                {inactiveLevel2cards && displayInActiveCard(2)}
                {level2cards.map(displayActiveCard)}
              </div>
            )}
            {level1cards && (
              <div
                style={{
                  backgroundColor: "#f4deff",
                  padding: 10,
                  display: "grid",
                  gap: 10,
                  gridTemplateColumns: "repeat(auto-fit, minmax(62px,1fr))",
                }}
              >
                {inactiveLevel1cards && displayInActiveCard(1)}
                {level1cards.map(displayActiveCard)}
              </div>
            )}
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
