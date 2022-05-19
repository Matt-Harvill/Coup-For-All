import { getGame } from "../utils/dbUtils.js";
import { endStage, getTurnProp, setTurn } from "./inProgressTurns.js";

// Handle a callout for tax action
const calloutHandler = (game, user, target, targetRoles, targetAction) => {
  let roleToCheck;
  let isTurnAction;
  switch (targetAction) {
    case "foreignAid":
      roleToCheck = "D";
      isTurnAction = false;
      break;
    case "tax":
      roleToCheck = "D";
      isTurnAction = true;
      break;
    default:
      throw `${targetAction} is not a valid callout action`;
  }

  let playerLosingRole, playerSwitchingRole, actionSuccess;
  // If the target has a "roleToCheck", they don't lose a role, just switch it out
  if (targetRoles.includes(roleToCheck)) {
    playerLosingRole = user.username;
    playerSwitchingRole = target;
    // Action success is same as isTurnAction
    actionSuccess = isTurnAction;
  } else {
    playerLosingRole = target;
    // Action success is opposite as isTurnAction
    actionSuccess = !isTurnAction;
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
      role: roleToCheck,
    };
  }

  console.log(
    "actionSuccess in callout for",
    targetAction,
    "is",
    actionSuccess
  );
  // Update roleSwitch object
  setTurn(game, {
    roleSwitch: {
      losing: losing,
      switching: switching,
    },
    actionSuccess: actionSuccess,
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

  calloutHandler(game, user, target, targetRoles, targetAction);
};
