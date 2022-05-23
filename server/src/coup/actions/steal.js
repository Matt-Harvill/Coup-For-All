import {
  endStage,
  endTurn,
  getTurnProp,
  setTurn,
  startNewStage,
} from "../inProgressTurns.js";
import { getGame, updateUserAndGame } from "../../utils/dbUtils.js";

export const stealEndStage = (game, stage) => {
  const target = getTurnProp(game.gameID, "target");

  switch (stage) {
    case "selectAction":
      setTurn(game, { stage: "challengeRole" });
      break;
    case "challengeRole":
      const loseSwap = getTurnProp(game.gameID, "loseSwap");
      if (loseSwap.losing || loseSwap.swapping) {
        setTurn(game, { stage: "loseSwapRoles" });
      } else {
        if (target.action === "steal") {
          setTurn(game, { stage: "blockAction" });
        } else if (target.action === "blockSteal") {
          endTurn(game);
        } else {
          throw `${target.action} not valid target action in steal`;
        }
      }
      break;
    case "blockAction":
      if (target.action === "blockSteal") {
        setTurn(game, { stage: "challengeRole" });
      } else if (target.action === "steal") {
        setTurn(game, { stage: "completeAction" });
      } else {
        throw `${target.action} not valid target action in steal`;
      }
      break;
    case "loseSwapRoles":
      const actionSuccess = getTurnProp(game.gameID, "actionSuccess");
      if (actionSuccess) {
        setTurn(game, { stage: "completeAction" });
      } else {
        endTurn(game);
      }
      break;
    case "completeAction":
      endTurn(game);
      return;
    default:
      throw `${stage} not valid endStage for tax`;
  }

  startNewStage(game);
};

export const completeSteal = async (game) => {
  const player = getTurnProp(game.gameID, "player");
  const target = getTurnProp(game.gameID, "attacking");

  const pStat = game.pStats.find((pStat) => pStat.player === player);
  const targetStat = game.pStats.find((pStat) => pStat.player === target);

  if (!pStat || !targetStat) {
    console.log(`Error completing steal for ${player} with target ${target}`);
  } else {
    if (targetStat.coins === 1) {
      targetStat.coins -= 1;
      pStat.coins += 1;
    } else if (targetStat.coins > 1) {
      targetStat.coins -= 2;
      pStat.coins += 2;
    } else {
      endStage(game);
      return;
    }

    const committed = await updateUserAndGame(player, game, "updateGame");

    if (!committed) {
      console.log(`Error committing steal for ${player} with target ${target}`);
    } else {
      endStage(game);
    }
  }
};

export const selectSteal = async (user, target) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const otherPlayers = game.players.filter(
      (player) => player !== user.username
    );

    setTurn(game, {
      action: "steal",
      attacking: target,
      target: { target: user.username, action: "steal", attacking: target },
      challenging: otherPlayers,
    });

    endStage(game);
  }
};
