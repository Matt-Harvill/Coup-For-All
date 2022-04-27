import * as dbUtils from "../dbUtils.js";
import { CoupGame } from "../schemas.js";
import { coupFormingGames, sendFormingGames } from "./coup.js";
import { updateUserSocketAndClient } from "../socketUtils.js";

export const leaveGame = async (socket) => {
  const userObj = socket.request.user;
  // Get the game
  const game = await CoupGame.findOne({
    gameID: userObj.gameID,
  }).exec();

  const user = userObj.username;
  // Update players
  game.players = game.players.filter((player) => player !== user);
  // Update pStats
  game.pStats.delete(user);

  // If game is empty now, delete the game
  let gameDeleted;
  let committed;
  if (game.players.length === 0) {
    committed = await dbUtils.updateUserAndGame(user, game, "lastPlayerLeft");
    gameDeleted = true;
  } else {
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

    // Update the user's socket and client then update everyone with new forming games
    await updateUserSocketAndClient(socket.request.user.username);
    sendFormingGames();
  }
};
