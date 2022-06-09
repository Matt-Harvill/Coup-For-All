import { gameOver } from "./gameOver.js";
import { deleteTurn, endTurn, getTurnProp } from "./turns.js";

export const splendorDBUpdateTurnHandler = async (
  game,
  updatedGame,
  update,
  user
) => {
  // Do stuff for specific game (splendor)
  switch (update) {
    case "deleteGame":
      // If game is deleted, delete the turn
      deleteTurn(game.gameID);
      break;
    case "updateGame":
    case "leaveGame":
      // If only one player is left, set game to "completed" with the winner as the last player
      if (updatedGame && updatedGame.players) {
        if (updatedGame.players.length === 1) {
          await gameOver(updatedGame);
        } else {
          const player = getTurnProp(game.gameID, "player");
          if (user && !updatedGame.players.includes(user) && user === player) {
            await endTurn(updatedGame);
          }
        }
      }
      break;
    default:
      break;
  }
};
