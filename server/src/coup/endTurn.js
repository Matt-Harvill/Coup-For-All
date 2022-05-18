import { getGame, updateUserAndGame } from "../utils/dbUtils.js";
import { inProgressGameStatuses, nextTurn } from "./nextTurn.js";

export const endTurn = async (user, game) => {
  if (user) {
    game = await getGame(user.gameTitle, user.gameID);
  }

  const gameID = game.gameID;

  if (!user || inProgressGameStatuses[gameID].activePlayer === user.username) {
    // Clear the interval
    clearInterval(inProgressGameStatuses[gameID].interval);
    // Reset the game status object
    inProgressGameStatuses[gameID].interval = null;
    inProgressGameStatuses[gameID].turnTime = 0;

    const activePlayer = game.players.shift(); // Pop off the queue
    game.players.push(activePlayer); // Push player to end of queue

    console.log(game.players, "in endTurn");
    await updateUserAndGame(activePlayer, game, "updateGame"); // Update the game (So turn order is saved)
    const updatedGame = await getGame(game.gameTitle, gameID); // Get the updated game
    nextTurn(updatedGame, gameID);
  }
};
