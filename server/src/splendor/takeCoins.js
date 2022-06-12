import { getGame } from "../utils/dbUtils.js";

export const takeCoins = async (user, coinsToTake) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    console.log("taking coins...");
  }

  // const committed = await updateUserAndGame(user.username, game, "updateGame");

  // if (!committed) {
  //   console.log(`Error taking coins for ${user.username} in takeCoins`);
  // }

  // return committed;

  return true;
};
