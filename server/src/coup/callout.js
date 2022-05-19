import { getGame } from "../utils/dbUtils.js";
import { endStage, getTurnProp, setTurn } from "./inProgressTurns.js";

// Handle a callout for tax action
const taxCallout = (game, targetRoles, accuserRoles, user, target) => {
  const roleSwitching = "D";
  let playerLosingRole, playerSwitchingRole;
  // If the target has a duke, they don't lose a role, just switch it out
  if (targetRoles.includes("D")) {
    if (targetRoles.length == 1) {
      // Remove player from active play
    } else {
      playerLosingRole = user.username;
    }
    playerSwitchingRole = target;
  } else {
    if (accuserRoles.length == 1) {
      // Remove player from active play
    } else {
      playerLosingRole = target;
    }
  }

  // SetTurn to show who must lose a role
  setTurn(game, {
    roleSwitch: {
      losing: {
        player: playerLosingRole,
        numRoles: 2,
      },
      switching: {
        player: playerSwitchingRole,
        role: roleSwitching,
      },
    },
  });
  // Currently goes to postCallout (instead we want it to go to losingRole)
  endStage(game);
};

export const callout = async (user, target) => {
  const game = await getGame(user.gameTitle, user.gameID);
  const gameID = game.gameID;

  // Get action (to compare to roles)
  const targets = getTurnProp(gameID, "targets");
  const targetInfo = targets.find((turnTarget) => turnTarget.target === target);
  const targetAction = targetInfo.action;

  // Get roles for target (to compare to action)
  const targetPStat = game.pStats.find((pStat) => pStat.player === target);
  const targetRoles = targetPStat.roles;
  // Get roles for user (if user was wrong)
  const accuserPStat = game.pStats.find(
    (pStat) => pStat.player === user.username
  );
  const accuserRoles = accuserPStat.roles;

  switch (targetAction) {
    case "tax":
      taxCallout(game, targetRoles, accuserRoles, user, target);
      break;
    default:
      break;
  }
};
