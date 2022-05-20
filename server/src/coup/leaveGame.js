import * as dbUtils from "../utils/dbUtils.js";
import { CoupGame } from "../schemas.js";
import { coupFormingGames, sendFormingGames } from "./coup.js";

export const leaveGame = async (socket) => {
  const userObj = socket.request.user;
  if (!userObj) {
    return;
  }
  const user = userObj.username;

  // Get the game
  const game = await CoupGame.findOne({
    gameID: userObj.gameID,
  }).exec();

  let gameDeleted, committed;
  // If game will be empty now, delete the game
  if (game.players.length === 1 && game.players.includes(user)) {
    committed = await dbUtils.updateUserAndGame(user, game, "deleteGame");
    gameDeleted = true;
  } else {
    // Update players
    game.players = game.players.filter((player) => {
      return player !== user;
    });
    // Update outPlayers
    game.outPlayers = game.outPlayers.filter((player) => {
      return player !== user;
    });
    // Update pStats
    game.pStats = game.pStats.filter((pStat) => {
      return pStat.player !== user;
    });

    // Otherwise just indicate a player left the game
    committed = await dbUtils.updateUserAndGame(user, game, "leaveGame");
    gameDeleted = false;
  }

  if (committed) {
    // Update game in memory
    let gameToDelete;
    coupFormingGames.forEach((gameInSet) => {
      if (gameInSet.gameID === game.gameID) {
        gameToDelete = gameInSet;
      }
    });
    if (gameToDelete) {
      coupFormingGames.delete(gameToDelete);
      // If game still exists, add the updated version
      if (!gameDeleted) {
        coupFormingGames.add(game);
      }
    }

    // Update everyone with new forming games
    sendFormingGames();
  }
};
