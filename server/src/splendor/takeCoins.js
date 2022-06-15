import { getGame, updateUserAndGame } from "../utils/dbUtils.js";
import { getTurnProp } from "./turns.js";

export const takeCoins = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);
  if (!game) {
    return false;
  }

  const pStat = game.pStats.find((pStat) => pStat.player === user.username);
  const coinsToTake = getTurnProp(game.gameID, "selectedCoins");
  if (!coinsToTake || !pStat) {
    return false;
  }

  for (const [key, value] of Object.entries(game.coins)) {
    if (value < coinsToTake[key]) {
      return false;
    } else {
      game.coins[key] -= coinsToTake[key];
      pStat.coins[key] += coinsToTake[key];
    }
  }

  const committed = await updateUserAndGame(user.username, game, "updateGame");

  if (!committed) {
    console.log(`Error taking coins for ${user.username} in takeCoins`);
  }

  return committed;
};
