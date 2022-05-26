import { SplendorGame } from "../schemas.js";
import { updateUserAndGame } from "../utils/dbUtils.js";
import {
  sendFormingGames,
  splendorFormingGames,
} from "./splendorEventHandler.js";

export const deleteGame = async (socket) => {
  const userObj = socket.request.user;
  if (!userObj) {
    return;
  }
  // Get the game
  const game = await SplendorGame.findOne({
    gameID: userObj.gameID,
  }).exec();

  const committed = await updateUserAndGame(
    userObj.username,
    game,
    "deleteGame"
  );
  if (committed) {
    // Delete game from memory
    splendorFormingGames.forEach((gameInSet) => {
      if (gameInSet.gameID === game.gameID) {
        splendorFormingGames.delete(gameInSet);
      }
    });

    // Update everyone with new forming games
    sendFormingGames();
  }
};
