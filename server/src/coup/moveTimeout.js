import { getUserObj } from "../utils/dbUtils.js";
import { income } from "./income.js";
import { getTurnProp } from "./inProgressTurns.js";

export const moveTimeout = async (game) => {
  // For now it just takes income
  const player = getTurnProp(game.gameID, "player");
  const userObj = await getUserObj(player);
  await income(userObj);
};
