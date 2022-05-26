import { SplendorGame } from "../schemas.js";
import { updateUserAndGame } from "../utils/dbUtils.js";
import {
  sendFormingGames,
  splendorFormingGames,
} from "./splendorEventHandler.js";

export const leaveGame = async (socket) => {
  const userObj = socket.request.user;
  if (!userObj) {
    return;
  }
  const user = userObj.username;

  // Get the game
  const game = await SplendorGame.findOne({
    gameID: userObj.gameID,
  }).exec();

  let gameDeleted, committed;
  // If game will be empty now, delete the game
  if (game.players.length === 1 && game.players.includes(user)) {
    committed = await updateUserAndGame(user, game, "deleteGame");
    gameDeleted = committed;
  } else {
    // Update players
    game.players = game.players.filter((player) => {
      return player !== user;
    });
    // Update pStats
    game.pStats = game.pStats.filter((pStat) => {
      if (pStat.player) {
        return pStat.player !== user;
      }
    });

    // Otherwise just indicate a player left the game
    committed = await updateUserAndGame(user, game, "leaveGame");
    gameDeleted = false;
  }

  if (committed) {
    // Update game in memory
    let gameToDelete;
    splendorFormingGames.forEach((gameInSet) => {
      if (gameInSet.gameID === game.gameID) {
        gameToDelete = gameInSet;
      }
    });
    if (gameToDelete) {
      splendorFormingGames.delete(gameToDelete);
      // If game still exists, add the updated version
      if (!gameDeleted) {
        splendorFormingGames.add(game);
      }
    }

    // Update everyone with new forming games
    sendFormingGames();
  }
};
