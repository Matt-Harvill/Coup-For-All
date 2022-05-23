import * as dbUtils from "../utils/dbUtils.js";
import { createTurn } from "./inProgressTurns.js";

export const publicGameState = (game, username) => {
  // Change other players' data -> Don't show their roles to other clients
  const publicGame = JSON.parse(JSON.stringify(game._doc));
  const isSpectator = publicGame.outPlayers.includes(username);

  if (!isSpectator) {
    for (const pStat of publicGame.pStats) {
      let newRoles = [];
      for (const role of pStat.roles) {
        if (pStat.player !== username) {
          newRoles.push("hidden");
        } else {
          newRoles.push(role);
        }
      }
      pStat.roles = newRoles;
    }
  }

  return { ...publicGame, availRoles: null };
  // return publicGame;
};

export const getGameState = async (socket) => {
  const user = socket.request.user;
  if (!user) {
    return;
  }
  // Start the game's turns if it hasn't yet
  if (
    user.gameTitle &&
    user.gameID &&
    user.gameStatus &&
    user.gameStatus === "in progress"
  ) {
    const game = await dbUtils.getGame(user.gameTitle, user.gameID);
    createTurn(game);
  }

  const game = await dbUtils.getGame(user.gameTitle, user.gameID);
  const publicGame = publicGameState(game, user.username);
  socket.emit("coup", "updateGame", user.gameID, publicGame);
};
