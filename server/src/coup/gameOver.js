import { updateUserAndGame } from "../utils/dbUtils.js";
import { deleteTurn } from "./inProgressTurns.js";

export const gameOver = async (game) => {
  deleteTurn(game.gameID);
  // Set the winner
  const winner = game.players[0];
  game.winner = winner;
  game.status = "completed";
  // Update the game
  const committed = await updateUserAndGame(winner, game, "updateGame");
  if (!committed) {
    console.log("Error committing gameOver");
  }
};
