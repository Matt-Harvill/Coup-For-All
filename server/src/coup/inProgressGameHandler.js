// Manage the in progress games

import { getGame, updateUserAndGame } from "../utils/dbUtils.js";
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

export const endTurn = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);
  const gameID = game.gameID;

  inProgressGameStatuses[gameID];

  if (
    inProgressGameStatuses[gameID].activePlayer === user.username &&
    inProgressGameStatuses[gameID].turnTime > 100
  ) {
    // Clear the interval
    clearInterval(inProgressGameStatuses[gameID].interval);
    // Reset the game status object
    inProgressGameStatuses[gameID].interval = null;
    inProgressGameStatuses[gameID].turnTime = 0;

    const activePlayer = game.players.shift(); // Pop off the queue
    game.players.push(activePlayer); // Push player to end of queue

    await updateUserAndGame(activePlayer, game, "updateGame"); // Update the game (So turn order is saved)
    const updatedGame = await getGame(game.gameTitle, gameID); // Get the updated game
    console.log(updatedGame.players);
    nextTurn(updatedGame, gameID);
  }
};
