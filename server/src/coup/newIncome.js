import { getGame, updateUserAndGame } from "../utils/dbUtils.js";
import { endStage, setTurn } from "./inProgressTurns.js";

export const newIncome = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const pStat = game.pStats.find((pStat) => {
      if (pStat.player === user.username) {
        pStat.coins += 1;
        return pStat;
      }
    });

    if (!pStat) {
      console.log("Error updating income for", user.username);
    }

    const committed = await updateUserAndGame(user, game, "updateGame");

    if (!committed) {
      console.log("Error committing income for", user.username);
    } else {
      // Update the action to income
      setTurn(game, { action: "income" });
      // End the preCallout stage (income)
      endStage(game);
    }
  }
};
