import { getGame, updateUserAndGame } from "../../utils/dbUtils.js";
import { endStage, setTurn } from "../inProgressTurns.js";

export const coupEndStage = (game, stage) => {};

export const coupAction = async (user, target, role) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const pStat = game.pStats.find((pStat) => {
      if (pStat.player === user.username) {
        pStat.coins -= 7;
        return pStat;
      }
    });

    if (!pStat) {
      console.log("Error executing coup payment for", user.username);
    }

    if (pStat.coins < 0) {
      // This means the player didn't have enough coins
      return;
    }

    const committed = await updateUserAndGame(user, game, "updateGame");

    if (!committed) {
      console.log("Error committing coup payment for", user.username);
    } else {
      // Set the target to lose a role
      setTurn(game, {
        action: "coup",
        roleSwitch: {
          losing: {
            player: target,
            numRoles: 1,
            role: role,
          },
          switching: null,
        },
      });
      // End the preCallout stage (coupAction)
      endStage(game);
    }
  }
};
