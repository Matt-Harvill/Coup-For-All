import * as dbUtils from "../utils/dbUtils.js";
import { CoupGame } from "../schemas.js";
import { coupFormingGames, sendFormingGames } from "./coupEventHandler.js";
import { assignRoles } from "./assignRoles.js";

export const joinGame = async (socket, gameID) => {
  const userObj = socket.request.user;
  if (!userObj) {
    return;
  }

  // Get the game
  const game = await CoupGame.findOne({
    gameID: gameID,
  }).exec();

  // If space for a joining player
  if (game.maxPlayers > game.players.length) {
    const user = userObj.username;
    const pStat = {
      player: user,
      coins: 2,
      roles: ["", ""],
    };

    // Update players
    game.players.push(user);
    // Update pStats
    game.pStats.push(pStat);
    // Update gameFull
    let gameFull = false;
    if (game.players.length === game.maxPlayers) {
      gameFull = true;
    }
    // Update status
    game.status = gameFull ? "in progress" : game.status;
    let committed;

    // Update the User(s) and Game
    if (gameFull) {
      committed = await assignRoles(game);
    } else {
      committed = await dbUtils.updateUserAndGame(user, game, "updateGame");
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
        // Only add game back to list if game is still forming
        if (game.status === "forming") {
          coupFormingGames.add(game);
        }
      }

      // Update everyone with forming games
      sendFormingGames();
    }
  }
};
