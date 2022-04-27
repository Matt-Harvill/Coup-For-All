import * as dbUtils from "../utils/dbUtils.js";

export const assignRoles = async (game) => {
  const pStats = game.pStats;
  const availRoles = game.availRoles;

  const numRoles = availRoles.length;
  const rolesToAssign = 2;
  const rolesIndices = [];

  // Loop through the players and assign them two roles
  for (const [player, pStat] of pStats.entries()) {
    // Use indices so multiple items can be removed in one go
    let indices = [...Array(numRoles).keys()];
    for (let i = 0; i < rolesToAssign; i++) {
      let rand = Math.floor(Math.random() * indices.length);
      rolesIndices[i] = indices.splice(rand, 1);
      pStat.roles[i] = availRoles[rolesIndices[i]];
    }

    // Remove from larger index first so other index isn't corrupted
    if (rolesIndices[0] > rolesIndices[1]) {
      availRoles.splice(rolesIndices[0], 1);
      availRoles.splice(rolesIndices[1], 1);
    } else {
      availRoles.splice(rolesIndices[1], 1);
      availRoles.splice(rolesIndices[0], 1);
    }
  }

  const committed = await dbUtils.updateUserAndGame(
    undefined,
    game,
    "assignRoles"
  );
  if (!committed) {
    throw "error assigning roles";
  } else {
    // Return the game if it was committed
    return game;
  }
};
