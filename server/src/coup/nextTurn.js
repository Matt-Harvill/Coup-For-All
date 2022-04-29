import { io } from "../index.js";
import { socketIDMap } from "../utils/socketUtils.js";

export const nextTurn = async (game) => {
  const activePlayer = game.players.shift(); // Remove first player -> set as active player
  game.players.push(activePlayer); // Add player to end of players

  // Get all the sockets of players in the game
  const sockets = [];
  for (const player of game.players) {
    const socketID = socketIDMap[player];
    const socket = io.sockets.sockets.get(socketID);
    sockets.push(socket);
  }

  let turnTime = 10000; // 10 seconds for a turn

  const updateTimeInTurn = setInterval(() => {
    // Update them with time remaining in the turn
    for (const socket of sockets) {
      if (socket) {
        socket.emit(
          "coup",
          "timeInTurn",
          game.gameID,
          activePlayer,
          turnTime / 1000
        );
      }
    }

    turnTime -= 1000;

    if (turnTime === 0) {
      clearInterval(updateTimeInTurn);
      nextTurn(game);
    }
  }, 1000);
};
