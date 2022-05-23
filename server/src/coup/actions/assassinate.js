import {
  endStage,
  endTurn,
  getTurnProp,
  setTurn,
  startNewStage,
} from "../inProgressTurns.js";
import { getGame, updateUserAndGame } from "../../utils/dbUtils.js";

export const assassinateEndStage = (game, stage) => {
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
        if (target.action === "assassinate") {
          prepareAssassinate(game);
        } else if (target.action === "blockAssassinate") {
          setTurn(game, { stage: "completeAction" });
        } else {
          throw `${target.action} not valid target action in assassinate`;
        }
      }
      break;
    case "blockAction":
      if (target.action === "assassinate") {
        setTurn(game, { stage: "completeAction" });
      } else if (target.action === "blockAssassinate") {
        setTurn(game, { stage: "challengeRole" });
      } else {
        throw `${target.action} not valid target action in assassinate`;
      }
      break;
    case "loseSwapRoles":
      const actionSuccess = getTurnProp(game.gameID, "actionSuccess");
      if (actionSuccess) {
        if (target.action === "assassinate") {
          prepareAssassinate(game);
        } else if (target.action === "blockAssassinate") {
          setTurn(game, { stage: "completeAction" });
        } else {
          throw `${target.action} not valid target action in assassinate`;
        }
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

const prepareAssassinate = async (game) => {
  const pStat = game.pStats.find((pStat) => {
    if (pStat.player === user.username) {
      pStat.coins -= 3;
      return pStat;
    }
  });

  if (!pStat) {
    console.log(`Error preparing assassinate for ${user.username}`);
  } else {
    const committed = await updateUserAndGame(user, game, "updateGame");
    if (!committed) {
      console.log(`Error committing assassinate prep for ${user.username}`);
    } else {
      setTurn(game, { stage: "blockAction" });
    }
  }
};

export const completeAssassinate = async (game) => {
  const target = getTurnProp(game.gameID, "attacking");

  setTurn(game, {
    loseSwap: {
      losing: {
        player: target,
      },
    },
  });

  endStage(game);
};

export const selectAssassinate = async (user, target) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const otherPlayers = game.players.filter(
      (player) => player !== user.username
    );

    setTurn(game, {
      action: "assassinate",
      attacking: target,
      target: {
        target: user.username,
        action: "assassinate",
        attacking: target,
      },
      challenging: otherPlayers,
    });

    endStage(game);
  }
};
