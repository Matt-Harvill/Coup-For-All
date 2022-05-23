import { getGame, updateUserAndGame } from "../utils/dbUtils.js";
import { endStage, getTurnProp, setTurn } from "./inProgressTurns.js";

export const loseRole = async (user, roleToLose, game, player, loseSwapObj) => {
  let username;
  if (user) {
    game = await getGame(user.gameTitle, user.gameID);
    loseSwapObj = getTurnProp(game.gameID, "loseSwap");
    username = user.username;
  } else {
    username = player;
  }

  // Check that this player should be losing a role
  if (!(loseSwapObj.losing && loseSwapObj.losing.player === username)) {
    return;
  }

  // Get the pStat
  const pStat = game.pStats.find((pStat) => pStat.player === username);

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

  let committed;
  // If nothing changed, skip to the end of function (committed === true )
  if (!roleFound) {
    committed = true;
  } else {
    // Add roleToLose to the unavailable roles
    game.unavailRoles[roleToLose]++;
    // Update player's roles
    pStat.roles = newRoles;
    committed = await updateUserAndGame(username, game, "updateGame");
  }

  if (!committed) {
    console.log("Error committing loseRole for", username);
  } else {
    // Update the losing to null now that it has been switched
    const newRoleSwitch = { ...loseSwapObj, losing: null };
    setTurn(game, { loseSwap: newRoleSwitch });

    // If losing and swapping has been taken care of, end the stage
    const newRoleSwitchObj = getTurnProp(game.gameID, "loseSwap");
    if (!newRoleSwitchObj.swapping && !newRoleSwitchObj.losing) {
      endStage(game);
    }
  }
};
