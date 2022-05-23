import { getUserObj } from "../utils/dbUtils.js";
import { selectAndCompleteCoup } from "./actions/coup.js";
import { selectAndCompleteIncome } from "./actions/income.js";
import { endStage, getTurnProp, setTurn } from "./inProgressTurns.js";
import { loseRole } from "./loseRoles.js";

const randomElement = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

export const selectActionTimeout = async (game) => {
  const player = getTurnProp(game.gameID, "player");
  const userObj = await getUserObj(player);

  const pStat = game.pStats.find((pStat) => {
    return pStat.player === player;
  });

  if (!pStat) {
    console.log(
      `Error in selectActionTimeout for ${player} with gameID ${game.gameID}`
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
      await selectAndCompleteCoup(userObj, target, role);
    } else {
      // Auto take income if no action specified
      await selectAndCompleteIncome(userObj);
    }
  }
};

export const challengeTimeout = (game) => {
  const target = getTurnProp(game.gameID, "target");

  if (target) {
    switch (target.action) {
      case "blockAssassinate":
      case "blockSteal":
      case "blockForeignAid":
        setTurn(game, { actionSuccess: false });
        break;
      case "assassinate":
      case "tax":
      case "exchange":
      case "steal":
        setTurn(game, { actionSuccess: true });
      default:
        break;
    }
  }

  endStage(game);
};

export const loseSwapRolesTimeout = async (game) => {
  const loseSwap = getTurnProp(game.gameID, "loseSwap");

  if (loseSwap.losing) {
    const player = loseSwap.losing.player;
    const userObj = await getUserObj(player);

    const pStat = game.pStats.find((pStat) => {
      return pStat.player === player;
    });

    if (!pStat) {
      console.log(
        `Error in loseSwapRolesTimeout for ${player} with gameID ${game.gameID}`
      );
    } else {
      const roleToLose = randomElement(pStat.roles);
      // Lose Role ends the stage
      await loseRole(userObj, roleToLose, game, player, loseSwap);
    }
  }
};
