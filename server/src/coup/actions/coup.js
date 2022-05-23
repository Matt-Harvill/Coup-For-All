import {
  endStage,
  endTurn,
  getTurnProp,
  setTurn,
  startNewStage,
} from "../inProgressTurns.js";
import { getGame, updateUserAndGame } from "../../utils/dbUtils.js";

export const coupEndStage = (game, stage) => {
  switch (stage) {
    case "selectAction":
      const loseSwap = getTurnProp(game.gameID, "loseSwap");
      if (loseSwap.losing) {
        setTurn(game, { stage: "loseSwapRoles" });
      } else {
        endTurn(game);
      }
      break;
    case "loseSwapRoles":
      endTurn(game);
      break;
    default:
      throw `${stage} not valid endStage for coup`;
  }

  startNewStage(game);
};

export const selectAndCompleteCoup = async (user, target, role) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const pStat = game.pStats.find((pStat) => {
      if (pStat.player === user.username) {
        pStat.coins -= 7;
        return pStat;
      }
    });

    if (!pStat) {
      console.log(`Error completing coup for ${user.username}`);
    } else {
      if (pStat.coins < 0) {
        return;
      }

      const committed = await updateUserAndGame(user, game, "updateGame");
      if (!committed) {
        console.log(`Error committing coup for ${user.username}`);
      } else {
        setTurn(game, {
          action: "coup",
          loseSwap: {
            losing: {
              player: target,
              role: role,
            },
          },
        });

        endStage(game);
      }
    }
  }
};
