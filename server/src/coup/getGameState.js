import * as dbUtils from "../utils/dbUtils.js";

export const publicGameState = (game, username) => {
  // Change other players' data -> Don't show their roles to other clients
  const publicGame = JSON.parse(JSON.stringify(game._doc));

  for (const pStat of publicGame.pStats) {
    if (pStat.player !== username) {
      pStat.roles = ["default", "default"];
    }
  }
  return publicGame;
};

export const getGameState = async (socket) => {
  const user = socket.request.user;
  const game = await dbUtils.getGame(user.gameTitle, user.gameID);
  const publicGame = publicGameState(game, user.username);
  socket.emit("coup", "updateGame", user.gameID, publicGame);
};
