import { getGame } from "../utils/dbUtils.js";
import { endStage, getTurnProp, setTurn } from "./inProgressTurns.js";

export const callout = async (user, target) => {
  const game = await getGame(user.gameTitle, user.gameID);
  const gameID = game.gameID;

  // Get action (to compare to roles)
  const targets = getTurnProp(gameID, "targets");
  const targetInfo = targets.find((turnTarget) => turnTarget.target === target);
  const action = targetInfo.action;

  // Get roles (to compare to action)
  const targetPStat = game.pStats.find((pStat) => pStat.player === target);
  const roles = targetPStat.roles;

  switch (action) {
    case "tax":
      let losingRole;
      // If the player has a duke
      if (roles.includes("D")) {
        losingRole = user.username;
      } else {
        losingRole = target;
      }
      // SetTurn to show who must lose a role
      setTurn(game, { losingRole: losingRole });
      // Currently goes to postCallout (instead we want it to go to losingRole)
      endStage(game);
      break;
    default:
      break;
  }
};
