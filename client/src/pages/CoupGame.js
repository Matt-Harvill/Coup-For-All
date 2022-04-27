import { useContext, useEffect, useState } from "react";
import AppContext from "../components/AppContext";
import { socket } from "../socket";

export default function CoupGame() {
  const { userObj } = useContext(AppContext);
  const [game, setGame] = useState({});
  // Setup coup socket listener
  useEffect(() => {
    socket.on("coup", (event, gameID, ...args) => {
      if (gameID === userObj.gameID) {
        switch (event) {
          case "gameState":
            const gameState = args[0];
            setGame(gameState);
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

  return (
    <div className="page">
      <h1 style={{ textAlign: "center" }}>CoupGame</h1>
      <span>{JSON.stringify(game)}</span>
    </div>
  );
}
