import * as dbUtils from "../utils/dbUtils.js";
import { CoupGame } from "../schemas.js";
import { coupFormingGames, sendFormingGames } from "./coup.js";
import { updateUserSocketAndClient } from "../utils/socketUtils.js";

export const deleteGame = async (socket) => {
  const userObj = socket.request.user;
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

    // Update the user's socket and client then update everyone with new forming games
    await updateUserSocketAndClient(socket.request.user.username);
    sendFormingGames();
  }
};
