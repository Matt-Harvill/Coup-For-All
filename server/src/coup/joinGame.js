import * as dbUtils from "../utils/dbUtils.js";
import { CoupGame } from "../schemas.js";
import { coupFormingGames, sendFormingGames } from "./coup.js";
import { updateUserSocketAndClient } from "../utils/socketUtils.js";

export const joinGame = async (socket, gameID) => {
  const userObj = socket.request.user;

  // Get the game
  const game = await CoupGame.findOne({
    gameID: gameID,
  }).exec();

  // If space for a joining player
  if (game.maxPlayers > game.players.length) {
    const user = userObj.username;
    const pStat = { coins: 2, roles: ["", ""] };

    let gameFull = false;
    // If this fills the game, set its status to in progress
    if (game.players.length + 1 === game.maxPlayers) {
      gameFull = true;
    }
    // Update players
    game.players.push(user);
    // Update pStats
    game.pStats.set(user, pStat);
    // Update status
    game.status = gameFull ? "in progress" : game.status;

    const committed = await dbUtils.updateUserAndGame(user, game, "joinGame");
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
        // Only add game back to list if game is still forming
        if (game.status === "forming") {
          coupFormingGames.add(game);
        }
      }

      // If game filled, update all the players instead of just this one
      let playersToUpdate;
      if (gameFull) {
        playersToUpdate = game.players;
      } else {
        playersToUpdate = [socket.request.user.username];
      }
      await updateUserSocketAndClient(...playersToUpdate);
      sendFormingGames();
    }
  }
};
