import { getGame, updateUserAndGame } from "../utils/dbUtils.js";
import { endStage, getTurnProp, setTurn } from "./inProgressTurns.js";

export const loseRole = async (user, roleToLose) => {
  const game = await getGame(user.gameTitle, user.gameID);
  const pStat = game.pStats.find((pStat) => pStat.player === user.username);

  // Check that this player should be losing a role
  const roleSwitchObj = getTurnProp(game.gameID, "roleSwitch");
  if (
    !(roleSwitchObj.losing && roleSwitchObj.losing.player === user.username)
  ) {
    return;
  }

  // Add roleToLose to the unavailable roles
  game.unavailRoles.push(roleToLose);
  // Remove role from pStat
  let newRoles = [];
  let roleFound = false;
  for (const role of pStat.roles) {
    if (!roleFound && role === roleToLose) {
      roleFound = true;
    } else {
      newRoles.push(role);
    }
  }
  // Update player's roles
  pStat.roles = newRoles;

  const committed = await updateUserAndGame(user.username, game, "updateGame");

  if (!committed) {
    console.log("Error committing loseRole for", user.username);
  } else {
    const newRoleSwitch = { ...roleSwitchObj, losing: null };
    // Update the losing to null now that it has been switched
    setTurn(game, { roleSwitch: newRoleSwitch });

    // If losing and switching has been taken care of, end the stage
    const newRoleSwitchObj = getTurnProp(game.gameID, "roleSwitch");
    if (!newRoleSwitchObj.switching && !newRoleSwitchObj.losing) {
      endStage(game);
    }
  }
};
