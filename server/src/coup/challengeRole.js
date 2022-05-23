import { getGame } from "../utils/dbUtils.js";
import { endStage, getTurnProp, setTurn } from "./inProgressTurns.js";

const challengeHandler = (game, user, target, targetRoles, targetAction) => {
  let roleToCheck;
  let isTurnAction;
  switch (targetAction) {
    // Actions are turnAction
    case "tax":
      roleToCheck = "Duke";
      isTurnAction = true;
      break;
    case "exchange":
      roleToCheck = "Ambassador";
      isTurnAction = true;
      break;
    case "steal":
      roleToCheck = "Captain";
      isTurnAction = true;
      break;
    case "assassinate":
      roleToCheck = "Assassin";
      isTurnAction = true;
      break;
    // Blocks are not turnAction
    case "blockForeignAid":
      roleToCheck = "Duke";
      isTurnAction = false;
      break;
    case "blockSteal":
      const target = getTurnProp(game.gameID, "target");
      roleToCheck = target.blockingRole;
      isTurnAction = false;
      break;
    case "blockAssassinate":
      roleToCheck = "Contessa";
      isTurnAction = false;
      break;
    default:
      throw `${targetAction} is not a valid challenge action`;
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

  // Create losing object for use in loseSwap obj
  const losing = {
    player: playerLosingRole,
  };
  // Create swapping object for use in loseSwap obj
  let swapping = null;
  if (playerSwitchingRole) {
    swapping = {
      player: playerSwitchingRole,
      role: roleToCheck,
    };
  }

  setTurn(game, {
    loseSwap: {
      losing: losing,
      swapping: swapping,
    },
    actionSuccess: actionSuccess,
  });

  endStage(game);
};

export const challengeRole = async (user, target) => {
  const game = await getGame(user.gameTitle, user.gameID);
  const gameID = game.gameID;

  // Get action (to compare to roles)
  const targetObj = getTurnProp(gameID, "target");
  const targetAction = targetObj.action;

  // Get roles for target (to compare to action)
  const targetPStat = game.pStats.find((pStat) => pStat.player === target);
  const targetRoles = targetPStat.roles;

  challengeHandler(game, user, target, targetRoles, targetAction);
};
