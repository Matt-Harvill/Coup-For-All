import {
  endStage,
  endTurn,
  getTurnProp,
  setTurn,
  startNewStage,
} from "../inProgressTurns.js";
import { getGame, updateUserAndGame, getUserObj } from "../../utils/dbUtils.js";

// ForeignAid -> selectAction, blockAction (challengeRole (loseSwapRoles)), completeAction

export const foreignAidEndStage = (game, stage) => {
  switch (stage) {
    case "selectAction":
      setTurn(game, { stage: "blockAction" });
      break;
    case "blockAction":
      // If there is a target, that means someone blocked, so start challenge stage
      const target = getTurnProp(game.gameID, "target");
      if (target) {
        setTurn(game, { stage: "challengeRole" });
      } else {
        setTurn(game, { stage: "completeAction" });
      }
      break;
    case "challengeRole":
      const loseSwap = getTurnProp(game.gameID, "loseSwap");
      if (loseSwap.losing || loseSwap.swapping) {
        setTurn(game, { stage: "loseSwapRoles" });
      } else {
        // If challengeRole had no challenge, foreignAid was successfully blocked
        endTurn(game);
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
      throw `${stage} not valid endStage for foreignAid`;
  }

  startNewStage(game);
};

export const completeForeignAid = async (game) => {
  const player = getTurnProp(game.gameID, "player");
  const user = await getUserObj(player);

  const pStat = game.pStats.find((pStat) => {
    if (pStat.player === user.username) {
      pStat.coins += 2;
      return pStat;
    }
  });

  if (!pStat) {
    console.log(`Error completing foreignAid for ${user.username}`);
  } else {
    const committed = await updateUserAndGame(user, game, "updateGame");
    if (!committed) {
      console.log(`Error committing foreignAid for ${user.username}`);
    } else {
      endStage(game);
    }
  }
};

export const selectForeignAid = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (!game) {
    console.log(`Error selecting foreignAid for ${user.username}`);
  } else {
    const otherPlayers = game.players.filter(
      (player) => player !== user.username
    );

    setTurn(game, {
      action: "foreignAid",
      challenging: otherPlayers,
    });

    endStage(game);
  }
};
