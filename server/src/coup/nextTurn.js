import { getSocket } from "../utils/socketUtils.js";
import { endTurn } from "./endTurn.js";

// Store the inProgress games' statuses (mapped by gameID)
export const inProgressGameStatuses = {};

export const nextTurn = (game, gameID) => {
  // Game no longer exists
  if (!game) {
    delete inProgressGameStatuses[gameID];
    return;
  }

  let turnTime, activePlayer;
  const updatePeriod = 100; // Update every 100ms

  if (
    !inProgressGameStatuses[gameID] ||
    inProgressGameStatuses[gameID].turnTime === 0
  ) {
    turnTime = 60000; // 60 seconds for a turn
    activePlayer = game.players[0]; //Set first player as active player
  }
  // If the turntime and activeplayer are already set, keep their values as long as their turn wasn't over
  else {
    turnTime = inProgressGameStatuses[gameID].turnTime; // Otherwise keep turnTime that already exists
    activePlayer = inProgressGameStatuses[gameID].activePlayer; // Otherwise keep activePlayer that already exists
  }

  // Update initial game status
  inProgressGameStatuses[gameID] = {
    activePlayer: activePlayer,
    turnTime: turnTime,
    interval: null,
  };

  const updateTimeInTurn = setInterval(async () => {
    // Update them with time remaining in the turn
    for (const player of game.players) {
      const socket = getSocket(player); // Get all the sockets of players in the game
      if (socket) {
        socket.emit(
          "coup",
          "timeInTurn",
          gameID,
          activePlayer,
          turnTime / 1000 // Send the time remaining in seconds
        );
      }
    }

    turnTime -= updatePeriod;
    inProgressGameStatuses[gameID].turnTime = turnTime;

    if (turnTime === 0) {
      await endTurn(null, game);
    }
  }, updatePeriod);

  inProgressGameStatuses[gameID].interval = updateTimeInTurn; // Sets interval after interval declared
};
