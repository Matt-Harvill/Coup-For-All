import { gameOver } from "./gameOver.js";
import { deleteTurn, endTurn, getTurnProp } from "./inProgressTurns.js";

export const coupDBUpdateTurnHandler = async (
  game,
  updatedGame,
  update,
  username
) => {
  // Do stuff for specific game (coup)
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
          const attacked = getTurnProp(game.gameID, "attacking");
          if (
            username &&
            !updatedGame.players.includes(username) &&
            (username === player || username === attacked)
          ) {
            await endTurn(updatedGame);
          }
        }
      }
      break;
    default:
      break;
  }
};
