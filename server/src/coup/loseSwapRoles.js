import { updateUserAndGame } from "../utils/dbUtils.js";
import { shuffleArray } from "../utils/shuffleArray.js";
import {
  endStage,
  getTurnProp,
  setTurn,
  turnExists,
} from "./inProgressTurns.js";
import { loseRole } from "./loseRole.js";

const removePlayerFromGame = async (game, player, playerRoles) => {
  //--- Remove player from the game ---//
  // Add roles to the unavailable roles
  for (const role of playerRoles) {
    // Add roleToLose to the unavailable roles
    game.unavailRoles[role]++;
  }
  // Move player to outPlayers
  game.outPlayers.push(player);
  // Delete pStat and player from players
  game.pStats = game.pStats.filter((pStat) => pStat.player !== player);
  game.players = game.players.filter((gamePlayer) => gamePlayer !== player);

  const committed = await updateUserAndGame(player, game, "updateGame");
  return committed;
};

const endOfLoseRoleAuto = (game, loseSwapObj, stillNeedToLoseRole) => {
  // If the turn has been deleted, then the stage is over
  if (!turnExists(game.gameID)) {
    return true;
  }

  // Don't reset losingObj if stillNeedToLoseRole
  if (stillNeedToLoseRole) {
    return;
  } else {
    // Update the losing to null now that it has been switched
    const newRoleSwitch = { ...loseSwapObj, losing: null };
    setTurn(game, { loseSwap: newRoleSwitch });

    // If losing and swapping has been taken care of, end the stage
    const newRoleSwitchObj = getTurnProp(game.gameID, "loseSwap");
    if (!newRoleSwitchObj.swapping && !newRoleSwitchObj.losing) {
      endStage(game);
      // Return true for stage ending
      return true;
    }
  }
};

export const loseRoleAuto = async (game, player, numRolesLosing) => {
  const loseSwapObj = getTurnProp(game.gameID, "loseSwap");
  const pStat = game.pStats.find((pStat) => pStat.player === player);
  console.log("pStat, player", pStat, player, "in loseRoleAuto");
  const playerRoles = pStat.roles;
  const numRoles = playerRoles.length;

  let removeOneRole, roleToLose, playerOut, committed, stillNeedToLoseRole;

  // Cases:
  // Attempt to remove specific role fails -> do nothing (cleanup tho)
  // remove one of two roles (not automatically) -> do nothing (cleanup tho)
  // remove one of two roles (automatically - both are same or it is specified and found)
  // remove one/one or two/two (player is out)

  // Specific role to lose is specified
  if (loseSwapObj.losing.role) {
    // Player has the role
    if (playerRoles.includes(loseSwapObj.losing.role)) {
      // It is player's only role
      if (playerRoles.length === 1) {
        playerOut = true;
      }
      // It is not player's only role
      removeOneRole = true;
      // Either way
      roleToLose = loseSwapObj.losing.role;
    } else {
      stillNeedToLoseRole = false;
    }
  }
  // Specific role to lose is not specified
  else {
    // Player will not lose from this role loss
    if (numRolesLosing < numRoles) {
      // Both roles are the same
      if (playerRoles[0] === playerRoles[1]) {
        // Changing so that not automatically lose even if they have the same role
        // removeOneRole = true;
        // roleToLose = playerRoles[0];
      }
    }
    // Player will lose from this role loss
    else {
      playerOut = true;
    }
  }

  // Loss results in player losing game
  if (playerOut) {
    committed = await removePlayerFromGame(game, player, playerRoles);
  }
  // Loss results in player losing one role
  else if (removeOneRole) {
    // loseRole cleans up
    await loseRole(null, roleToLose, game, player, loseSwapObj);
    // Return true for stage ending
    return true;
  } else {
    committed = true;
  }

  // If stillNeedToLoseRole hasn't been set to false, check if it needs to be updated
  if (stillNeedToLoseRole !== false) {
    stillNeedToLoseRole = !playerOut && !removeOneRole;
  }

  if (!committed) {
    console.log("Error committing loseRoleAuto for", player);
  } else {
    // Return true for stage ending
    return endOfLoseRoleAuto(game, loseSwapObj, stillNeedToLoseRole);
  }
};

export const switchRole = async (game, player, roleToSwitch) => {
  const loseSwapObj = getTurnProp(game.gameID, "loseSwap");
  const pStat = game.pStats.find((pStat) => pStat.player === player);

  let newRoles = [];
  let roleFound = false;
  for (const role of pStat.roles) {
    if (!roleFound && role === roleToSwitch) {
      roleFound = true;
    } else {
      newRoles.push(role);
    }
  }

  // Update player's roles
  pStat.roles = newRoles;
  // Add removed role back to availRoles
  game.availRoles.push(roleToSwitch);
  // Shuffle availRoles
  shuffleArray(game.availRoles);
  // Add new role to player's roles
  const newRole = game.availRoles.shift(); // Pop off the array
  pStat.roles.unshift(newRole); // Add to front of pStat roles

  const committed = await updateUserAndGame(player, game, "updateGame");

  if (!committed) {
    console.log("Error committing switchRole for", player);
  } else {
    // Update the swapping to null now that it has been switched
    const newRoleSwitch = { ...loseSwapObj, swapping: null };
    setTurn(game, { loseSwap: newRoleSwitch });

    // If losing and swapping has been taken care of, end the stage
    const newRoleSwitchObj = getTurnProp(game.gameID, "loseSwap");
    if (!newRoleSwitchObj.swapping && !newRoleSwitchObj.losing) {
      endStage(game);
      // Return true for stage ending
      return true;
    }
  }
};
