import { getUserObj } from "../utils/dbUtils.js";
import { coupAction } from "./actions/coupAction.js";
import { selectIncome } from "./actions/income.js";
import { endStage, getTurnProp, setTurn } from "./inProgressTurns.js";
import { loseRole } from "./loseRoles.js";

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
      await selectIncome(userObj);
    }
  }
};

export const calloutTimeout = (game) => {
  const target = getTurnProp(game.gameID, "target");

  if (target) {
    switch (target.action) {
      case "blockSteal":
      case "foreignAid": // If target's action is foreignAid, it was successfully blocked (actionSuccess === false)
        setTurn(game, { actionSuccess: false });
        break;
      case "tax": // If target's action is tax and callout timed out, action was successful
      case "exchange":
      case "steal":
        setTurn(game, { actionSuccess: true });
      default:
        break;
    }
  }

  // End the callout stage
  endStage(game);
};

export const roleSwitchTimeout = async (game) => {
  const roleSwitch = getTurnProp(game.gameID, "roleSwitch");

  if (roleSwitch.losing) {
    const player = roleSwitch.losing.player;
    const userObj = await getUserObj(player);

    const pStat = game.pStats.find((pStat) => {
      return pStat.player === player;
    });

    if (!pStat) {
      console.log(
        `Error in roleSwitchTimeout for ${player} with gameID ${game.gameID}`
      );
    } else {
      const roleToLose = randomElement(pStat.roles);
      // Lose a random role
      await loseRole(userObj, roleToLose, game, player, roleSwitch);
      // Lose Role ends the stage
    }
  }
};
