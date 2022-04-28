import * as dbUtils from "../utils/dbUtils.js";

export const publicGameState = (game, username) => {
  const pStats = game.pStats;

  console.log("Before hiding other players' data:", pStats);

  // Seems that pStats gets converted from Map to JSON sometimes
  let pStatsMap;
  if (pStats instanceof Map) {
    pStatsMap = pStats;
  } else {
    pStatsMap = new Map(Object.entries(pStats));
  }

  // Use map to iterate and change other players' data
  for (const [player, pStat] of pStatsMap) {
    if (player !== username) {
      pStat.roles = ["default", "default"];
    }
  }

  // Make sure the game's pStats are updated (in case switching to Map)
  game.pStats = pStatsMap;
  console.log("After hiding other players' data:", pStatsMap);

  return game;
};

export const getGameState = async (socket) => {
  const username = socket.request.user.username;
  const gameID = socket.request.user.gameID;
  const gameTitle = socket.request.user.gameTitle;
  const game = await dbUtils.getGame(gameTitle, gameID);
  const publicGame = publicGameState(game, username);
  socket.emit("coup", "updateGame", gameID, publicGame);
};
