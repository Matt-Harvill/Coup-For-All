import * as dbUtils from "../dbUtils.js";
import { CoupGame } from "../schemas.js";
import { coupFormingGames } from "./coup.js";

export const deleteGame = async (userObj) => {
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
  }
};
