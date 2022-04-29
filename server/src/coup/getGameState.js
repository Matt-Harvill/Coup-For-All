import * as dbUtils from "../utils/dbUtils.js";

export const publicGameState = (game, username) => {
  // Change other players' data -> Don't show their roles to other clients
  for (const pStat of game.pStats) {
    if (pStat.player !== username) {
      pStat.roles = ["default", "default"];
    }
  }
  return game;
};

export const getGameState = async (socket) => {
  const user = socket.request.user;
  const game = await dbUtils.getGame(user.gameTitle, user.gameID);
  const publicGame = publicGameState(game, user.username);
  socket.emit("coup", "updateGame", user.gameID, publicGame);
};
