// Manage the in progress games

import { inProgressGameStatuses, nextTurn } from "./nextTurn.js";

export const inProgressGameHandler = (game, gameID) => {
  // If this game doesn't already have a status (It's not executing) -> go to its next turn
  if (!inProgressGameStatuses[gameID]) {
    nextTurn(game, gameID);
  } else {
    // If the game is currently executing the setInterval function, end it and restart with current game info
    const interval = inProgressGameStatuses[gameID].interval;
    if (interval) {
      clearInterval(interval);

      // If the activePlayer isn't still in the game, delete the inProgressGameStatus and it'll reset turns
      if (
        !(
          game &&
          game.players.find((player) => {
            return player === inProgressGameStatuses[gameID].activePlayer;
          })
        )
      ) {
        delete inProgressGameStatuses[gameID];
      }

      nextTurn(game, gameID);
    }
  }
};
