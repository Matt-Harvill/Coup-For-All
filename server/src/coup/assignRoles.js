import * as dbUtils from "../utils/dbUtils.js";

export const assignRoles = async (game) => {
  const availRoles = game.availRoles;

  const numRoles = availRoles.length;
  const rolesToAssign = 2;
  const rolesIndices = [];

  // Seems that pStats gets converted from Map to JSON sometimes
  let pStats;
  if (game.pStats instanceof Map) {
    pStats = game.pStats;
  } else {
    pStats = new Map(Object.entries(game.pStats));
  }

  // Loop through the players and assign them two roles
  for (const [player, pStat] of pStats) {
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

  // Make sure the game's pStats are updated (in case switching to Map)
  game.pStats = pStats;
  console.log("game pStats after assigned roles", game.pStats);

  const committed = await dbUtils.updateUserAndGame(
    undefined,
    game,
    "assignRoles"
  );

  const updatedGame = await dbUtils.getGame(game.gameTitle, game.gameID);
  console.log("game pStats in DB after assigned roles:", updatedGame.pStats);

  return committed;
};
