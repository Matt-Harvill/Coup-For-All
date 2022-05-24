import {
  endStage,
  endTurn,
  getTurnProp,
  setTurn,
  startNewStage,
} from "../inProgressTurns.js";
import { getGame, updateUserAndGame, getUserObj } from "../../utils/dbUtils.js";

// Tax -> selectAction, challengeRole (loseSwapRoles), completeAction

export const taxEndStage = (game, stage) => {
  switch (stage) {
    case "selectAction":
      setTurn(game, { stage: "challengeRole" });
      break;
    case "challengeRole":
      const loseSwap = getTurnProp(game.gameID, "loseSwap");
      if (loseSwap.losing || loseSwap.swapping) {
        setTurn(game, { stage: "loseSwapRoles" });
      } else {
        // No one challenged tax
        setTurn(game, { stage: "completeAction" });
        completeTax(game);
      }
      break;
    case "loseSwapRoles":
      const actionSuccess = getTurnProp(game.gameID, "actionSuccess");
      if (actionSuccess) {
        setTurn(game, { stage: "completeAction" });
        completeTax(game);
      } else {
        endTurn(game);
        return;
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

export const completeTax = async (game) => {
  const player = getTurnProp(game.gameID, "player");
  const user = await getUserObj(player);

  const pStat = game.pStats.find((pStat) => {
    if (pStat.player === user.username) {
      pStat.coins += 3;
      return pStat;
    }
  });

  if (!pStat) {
    console.log(`Error completing tax for ${user.username}`);
  } else {
    const committed = await updateUserAndGame(
      user.username,
      game,
      "updateGame"
    );
    if (!committed) {
      console.log(`Error committing tax for ${user.username}`);
    } else {
      endStage(game);
    }
  }
};

export const selectTax = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (!game) {
    console.log(`Error selecting tax for ${user.username}`);
  } else {
    const otherPlayers = game.players.filter(
      (player) => player !== user.username
    );

    setTurn(game, {
      action: "tax",
      target: { target: user.username, action: "tax" },
      challenging: otherPlayers,
    });

    endStage(game);
  }
};
