import {
  endStage,
  endTurn,
  setTurn,
  startNewStage,
} from "../inProgressTurns.js";
import { getGame, updateUserAndGame } from "../../utils/dbUtils.js";
import { shuffleArray } from "../../utils/shuffleArray.js";

export const exchangeEndStage = (game, stage) => {};

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

export const exchangeRoles = async (user, roles) => {
  const game = await getGame(user.gameTitle, user.gameID);
  const pStat = game.pStats.find((pStat) => pStat.player === user.username);

  if (!pStat) {
    console.log("Error updating exchange for", user.username);
  }

  // Find which of the selected roles are new and which are not
  let newRoles = [];
  let oldRoles = [];
  for (const role of roles) {
    if (role.isNew) {
      newRoles.push(role.role);
    } else {
      oldRoles.push(role.role);
    }
  }

  // If a role was exchanged...
  if (newRoles.length > 0) {
    let availRoles = shuffleArray(game.availRoles);

    // Add back the role(s) that is/are being exchanged into availRoles
    for (const role of pStat.roles) {
      if (!oldRoles.includes(role)) {
        availRoles.push(role);
      } else {
        removeItemOnce(oldRoles, role);
      }
    }
    // Remove new roles from availRoles
    for (const role of newRoles) {
      removeItemOnce(availRoles, role);
    }
    // Update pStat
    pStat.roles = [];
    for (const role of roles) {
      pStat.roles.push(role.role);
    }

    // Set exchange roles to null (so exchangeButton hides before game update)
    setTurn(game, { exchangeRoles: null });

    const committed = await updateUserAndGame(user, game, "updateGame");

    if (!committed) {
      console.log("Error committing exchange for", user.username);
    }
  }

  // End the turn
  endTurn(game);
};

export const postCalloutExchange = async (game) => {
  // Start postCallout stage
  setTurn(game, { stage: "postCallout" });
  startNewStage(game);

  // Shuffle the availableRoles
  shuffleArray(game.availRoles);
  // First two roles will be exchangeRoles -> Should always be at least two roles
  const exchangeRoles = game.availRoles.slice(0, 2);
  // Set the turn's exchangeRoles
  setTurn(game, { exchangeRoles: exchangeRoles });
};

export const preCalloutExchange = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const otherPlayers = game.players.filter(
      (player) => player !== user.username
    );

    // Update the action to exchange, add player as a target, update deciding to be other players
    setTurn(game, {
      action: "exchange",
      target: { target: user.username, action: "exchange", attacking: "none" },
      deciding: otherPlayers,
    });

    // End the preCallout stage for exchange
    endStage(game);
  }
};
