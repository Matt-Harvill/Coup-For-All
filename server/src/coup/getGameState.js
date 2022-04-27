import * as dbUtils from "../utils/dbUtils.js";

const publicGameState = (game, username) => {
  const pStats = game.pStats;

  for (const [player, pStat] of Object.entries(pStats)) {
    if (player !== username) {
      pStat.roles = ["default", "default"];
    }
  }

  return game;
};

export const getGameState = async (socket) => {
  const username = socket.request.user.username;
  const gameID = socket.request.user.gameID;
  const game = await dbUtils.getGame(gameID);
  const publicGame = publicGameState(game, username);
  socket.emit("coup", "gameState", gameID, publicGame);
};
