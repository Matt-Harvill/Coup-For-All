import { useContext, useEffect, useState } from "react";
import AppContext from "../components/AppContext";
import SplendorActionbar from "../components/splendor/SplendorActionbar";
import SplendorActiveCard from "../components/splendor/SplendorActiveCard";
// import SplendorActionbar from "../components/splendor/SplendorActionbar";
import SplendorGameContext from "../components/splendor/SplendorGameContext";
import SplendorInactiveCard from "../components/splendor/SplendorInactiveCard";
import SplendorNobleCard from "../components/splendor/SplendorNobleCard";
import SplendorPlayerCard from "../components/splendor/SplendorPlayerCard";
// import SplendorPlayerCard from "../components/splendor/SplendorPlayerCard";
import { socket } from "../socket";
import splendorNewBackgroundColor from "../splendorNewBackgroundColor";

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
    // return <div>{JSON.stringify(pStat)}</div>;
    return <SplendorPlayerCard pStat={pStat} />;
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

  const displayNobleCard = (card) => {
    return <SplendorNobleCard card={card} />;
  };

  const displayActionbar = () => {
    if (game && game.players) {
      if (game.players[0] === userObj.username) {
        return <SplendorActionbar />;
      }
    }
  };

  const displayCoins = () => {
    const coins = game.coins;
    const coinSize = 50;

    let coinDivs = [];
    for (const [key, value] of Object.entries(coins)) {
      let color;
      if (key === "black") {
        color = "#EAEAEA";
      } else {
        color = "#464646";
      }
      coinDivs.push(
        <div
          style={{
            display: "flex",
            backgroundColor: splendorNewBackgroundColor(key),
            color: color,
            height: coinSize,
            width: coinSize,
            borderRadius: coinSize,
            justifyContent: "center",
            alignItems: "center",
            border: `1px solid ${color}`,
            fontSize: coinSize / 2,
          }}
        >
          {value}
        </div>
      );
    }

    return coinDivs;
  };

  return (
    <SplendorGameContext.Provider value={gameContext}>
      <div
        className="page splendorPage"
        style={{ height: "100%", overflowY: "auto" }}
      >
        {/* <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflowY: "scroll",
            flex: 0,
          }}
        > */}
        <h1 style={{ textAlign: "center", paddingTop: 20, paddingBottom: 20 }}>
          Splendor
        </h1>

        <div
          style={{
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 20,
            padding: 20,
            backgroundColor: "#464646",
          }}
        >
          {game.nobles && (
            <div
              style={{
                backgroundColor: "#f4deff",
                padding: 10,
                display: "grid",
                gap: 10,
                gridTemplateColumns: "repeat(auto-fit, minmax(62px,1fr))",
                marginBottom: 20,
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: 460,
              }}
            >
              {game.nobles.map(displayNobleCard)}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gap: 20,
              gridTemplateColumns: "repeat(auto-fit, minmax(190px,1fr))",
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

          {game.coins && (
            <div
              style={{
                backgroundColor: "#f4deff",
                padding: 10,
                display: "grid",
                gap: 10,
                gridTemplateColumns: "repeat(auto-fit, minmax(50px,1fr))",
                marginTop: 20,
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: 370,
              }}
            >
              {displayCoins()}
            </div>
          )}
        </div>

        <div
          style={{
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 20,
            // padding: 20,
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fill, minmax(245px,1fr))",
            // backgroundColor: "#464646",
          }}
        >
          {game && game.pStats && game.pStats.map(displayPlayer)}
        </div>
      </div>
      {displayActionbar()}
    </SplendorGameContext.Provider>
  );
}
