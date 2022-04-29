import * as dbUtils from "../utils/dbUtils.js";

export const assignRoles = async (game) => {
  const availRoles = game.availRoles;
  const pStats = game.pStats;
  const rolesToAssign = 2;

  // Loop through the players and assign them "rolesToAssign" roles
  for (const pStat of pStats) {
    for (let i = 0; i < rolesToAssign; i++) {
      let rand = Math.floor(Math.random() * availRoles.length);
      [pStat.roles[i]] = availRoles.splice(rand, 1);
    }
  }

  const committed = await dbUtils.updateUserAndGame(
    undefined,
    game,
    "assignRoles"
  );

  return committed;
};
