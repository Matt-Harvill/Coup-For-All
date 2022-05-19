import { updateUserAndGame } from "../utils/dbUtils.js";
import { setTurn } from "./inProgressTurns.js";

// Fisher-Yates (aka Knuth) Shuffle
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export const loseRoleAuto = async (
  game,
  player,
  numRolesLosing,
  roleSwitchObj
) => {
  const pStat = game.pStats.find((pStat) => pStat.player === player);
  const playerRoles = pStat.roles;
  const numRoles = playerRoles.length;

  // This function isn't for when the player has to decide which role to lose
  if (numRoles > numRolesLosing) {
    return;
  }

  // Remove player from the game
  for (const role of playerRoles) {
    // Add roles to the unavailable roles
    game.unavailRoles.push(role);
  }
  // Delete pStat and player from players
  game.pStats = game.pStats.filter((pStat) => pStat.player !== player);
  game.players = game.players.filter((gamePlayer) => gamePlayer !== player);

  const committed = await updateUserAndGame(player, game, "updateGame");

  if (!committed) {
    console.log("Error committing loseRoleAuto for", player);
  } else {
    const newRoleSwitch = { ...roleSwitchObj, losing: null };
    // Update the switching to null now that it has been switched
    setTurn(game, { roleSwitch: newRoleSwitch });
  }
};

export const switchRole = async (game, player, roleToSwitch, roleSwitchObj) => {
  const pStat = game.pStats.find((pStat) => pStat.player === player);
  console.log(pStat);

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
  shuffle(game.availRoles);
  // Add new role to player's roles
  const newRole = game.availRoles.shift(); // Pop off the array
  pStat.roles.unshift(newRole); // Add to front of pStat roles

  const committed = await updateUserAndGame(player, game, "updateGame");

  if (!committed) {
    console.log("Error committing switchRole for", player);
  } else {
    const newRoleSwitch = { ...roleSwitchObj, switching: null };
    // Update the switching to null now that it has been switched
    setTurn(game, { roleSwitch: newRoleSwitch });
  }
};
