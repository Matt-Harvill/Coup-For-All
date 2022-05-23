import { getGame, updateUserAndGame } from "../../utils/dbUtils.js";
import { endStage, endTurn, setTurn } from "../inProgressTurns.js";

export const incomeEndStage = (game, stage) => {
  switch (stage) {
    case "selectAction":
      endTurn(game);
      return;
    default:
      throw `${stage} not valid endStage for income`;
  }
};

export const selectAndCompleteIncome = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (!game) {
    console.log(`Error selecting income for ${user.username}`);
  } else {
    const pStat = game.pStats.find((pStat) => {
      if (pStat.player === user.username) {
        pStat.coins += 1;
        return pStat;
      }
    });

    if (!pStat) {
      console.log(`Error completing income for ${user.username}`);
    } else {
      const committed = await updateUserAndGame(user, game, "updateGame");
      if (!committed) {
        console.log(`Error committing income for ${user.username}`);
      } else {
        setTurn(game, { action: "income" });

        endStage(game);
      }
    }
  }
};
