import { SplendorGame } from "../schemas.js";
import { updateUserAndGame } from "../utils/dbUtils.js";
import {
  sendFormingGames,
  splendorFormingGames,
} from "./splendorEventHandler.js";

export const joinGame = async (socket, gameID) => {
  const userObj = socket.request.user;
  if (!userObj) {
    return;
  }

  // Get the game
  const game = await SplendorGame.findOne({
    gameID: gameID,
  }).exec();

  // If space for a joining player
  if (game.maxPlayers > game.players.length) {
    const user = userObj.username;
    // Create new pStat
    const pStat = {
      player: user,
      points: 0,
      permanentResources: {
        green: 0,
        blue: 0,
        red: 0,
        black: 0,
        white: 0,
      },
      coins: {
        green: 0,
        blue: 0,
        red: 0,
        black: 0,
        white: 0,
        yellow: 0,
      },
      cardsInHand: [],
      cardsOwned: [],
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

    // Update the User(s) and Game
    const committed = await updateUserAndGame(user, game, "updateGame");

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
        // Only add game back to list if game is still forming
        if (game.status === "forming") {
          splendorFormingGames.add(game);
        }
      }

      // Update everyone with forming games
      sendFormingGames();
    }
  }
};
