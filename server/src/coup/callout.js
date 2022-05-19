import { getGame } from "../utils/dbUtils.js";
import { endStage, getTurnProp, setTurn } from "./inProgressTurns.js";

// Handle a callout for tax action
const taxCallout = (game, targetRoles, user, target) => {
  const roleSwitching = "D";
  let playerLosingRole, playerSwitchingRole;
  // If the target has a duke, they don't lose a role, just switch it out
  if (targetRoles.includes("D")) {
    playerLosingRole = user.username;
    playerSwitchingRole = target;
  } else {
    playerLosingRole = target;
  }

  // Create losing object for use in roleSwitch obj
  const losing = {
    player: playerLosingRole,
    numRoles: 1,
  };
  // Create switching object for use in roleSwitch obj
  let switching = null;
  if (playerSwitchingRole) {
    switching = {
      player: playerSwitchingRole,
      role: roleSwitching,
    };
  }

  // Update roleSwitch object
  setTurn(game, {
    roleSwitch: {
      losing: losing,
      switching: switching,
    },
  });

  // Go to next stage => will be roleSwitch
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

  switch (targetAction) {
    case "tax":
      taxCallout(game, targetRoles, user, target);
      break;
    default:
      break;
  }
};
