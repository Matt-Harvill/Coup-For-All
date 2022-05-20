import { getUserObj } from "../utils/dbUtils.js";
import { income } from "./income.js";
import { endStage, getTurnProp, setTurn } from "./inProgressTurns.js";

export const moveTimeout = async (game) => {
  // For now it just takes income
  const player = getTurnProp(game.gameID, "player");
  const userObj = await getUserObj(player);
  await income(userObj);
};

export const calloutTimeout = (game) => {
  const targets = getTurnProp(game.gameID, "targets");

  if (targets && targets[0]) {
    const firstTarget = targets[0];
    switch (firstTarget.action) {
      case "foreignAid":
        setTurn(game, { actionSuccess: false });
        break;
      case "tax":
        setTurn(game, { actionSuccess: true });
      default:
        break;
    }
  }

  // End the callout stage
  endStage(game);
};
