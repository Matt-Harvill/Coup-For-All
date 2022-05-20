import { getUserObj } from "../utils/dbUtils.js";
import { coupAction } from "./coupAction.js";
import { income } from "./income.js";
import { endStage, getTurnProp, setTurn } from "./inProgressTurns.js";

const randomElement = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

export const moveTimeout = async (game) => {
  const player = getTurnProp(game.gameID, "player");
  const userObj = await getUserObj(player);

  const pStat = game.pStats.find((pStat) => {
    return pStat.player === player;
  });

  if (!pStat) {
    console.log(
      `Error in moveTimeout for ${player} with gameID ${game.gameID}`
    );
  } else {
    if (pStat.coins >= 10) {
      const otherPlayers = game.players.filter((player) => {
        return player !== userObj.username;
      });
      const roleNames = [
        "Ambassador",
        "Assassin",
        "Captain",
        "Contessa",
        "Duke",
      ];

      const target = randomElement(otherPlayers);
      const role = randomElement(roleNames);

      console.log(`Auto-couping ${target} for ${role}...`);

      await coupAction(userObj, target, role);
    } else {
      await income(userObj);
    }
  }
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
