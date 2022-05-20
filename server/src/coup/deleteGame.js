import * as dbUtils from "../utils/dbUtils.js";
import { CoupGame } from "../schemas.js";
import { coupFormingGames, sendFormingGames } from "./coup.js";

export const deleteGame = async (socket) => {
  const userObj = socket.request.user;
  if (!userObj) {
    return;
  }
  // Get the game
  const game = await CoupGame.findOne({
    gameID: userObj.gameID,
  }).exec();

  const committed = await dbUtils.updateUserAndGame(
    userObj.username,
    game,
    "deleteGame"
  );
  if (committed) {
    // Delete game from memory
    coupFormingGames.forEach((gameInSet) => {
      if (gameInSet.gameID === game.gameID) {
        coupFormingGames.delete(gameInSet);
      }
    });

    // Update everyone with new forming games
    sendFormingGames();
  }
};
