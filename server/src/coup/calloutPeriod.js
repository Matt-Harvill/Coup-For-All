import { getGame, updateUserAndGame } from "../utils/dbUtils.js";
import { getSocket } from "../utils/socketUtils.js";
import { inProgressGameStatuses, nextTurn } from "./nextTurn.js";

// Store the inProgress games' statuses (mapped by gameID)
export const calloutStatuses = {};

const endCallout = async (game) => {
  const gameID = game.gameID;
  // Clear the interval
  clearInterval(calloutStatuses[gameID].interval);
  // Reset the game status object
  calloutStatuses[gameID].interval = null;
  calloutStatuses[gameID].calloutTime = 0;
  calloutStatuses[gameID].needToDecide = [];

  game.calloutTargets = [];
  // Update game to remove calloutTargets
  await updateUserAndGame(null, game, "updateGame");

  // Continue the activePlayer's turn (reset turnTime to 60000 to give some time to complete turn)
  inProgressGameStatuses[gameID].turnTime = 60000;
  nextTurn(game, gameID);
};

const startCallout = (game) => {
  const gameID = game.gameID;

  let deciding; // For all deciding arrays, players array will be cloned (since editing it)

  const numCalloutTargets = game.calloutTargets.length;
  if (numCalloutTargets == 2) {
    const newestTarget = game.calloutTargets[1];

    deciding = [...game.players].filter(
      (player) => player !== newestTarget.target
    );
  } else if (numCalloutTargets == 1) {
    const target = game.calloutTargets[0];
    deciding = [...game.players].filter((player) => player !== target.target);
  }
  // Temporary -> won't be the case in the future because targets will always be set before startCallout
  else {
    deciding = [...game.players];
  }

  // Update callout status
  calloutStatuses[gameID] = {
    calloutTime: 30000, // 30s for a callout
    interval: null,
    needToDecide: deciding,
  };

  let calloutTime = calloutStatuses[gameID].calloutTime;
  const updatePeriod = 100; // Update every 100ms

  const updateCalloutTime = setInterval(async () => {
    // Update them with time remaining in the turn
    for (const player of game.players) {
      const socket = getSocket(player); // Get all the sockets of players in the game
      if (socket) {
        // console.log(calloutStatuses[gameID].needToDecide);
        socket.emit(
          "coup",
          "timeInCallout",
          gameID,
          calloutStatuses[gameID].needToDecide,
          game.players[0], // Active player is the target
          calloutTime / 1000 // Send the time remaining in seconds
        );
      }
    }

    calloutTime -= updatePeriod;
    calloutStatuses[gameID].calloutTime = updateCalloutTime;

    if (calloutTime === 0) {
      await endCallout(game);
    }
  }, updatePeriod);

  calloutStatuses[gameID].interval = updateCalloutTime; // Sets interval after interval declared
};

export const noCallout = async (user) => {
  const gameID = user.gameID;
  let deciding = calloutStatuses[gameID].needToDecide;
  // Remove player from still deciding
  deciding = deciding.filter((undecidedPlayer) => {
    return undecidedPlayer !== user.username;
  });

  const socket = getSocket(user.username);
  socket.emit("coup", "calloutReceived", gameID, deciding);

  // If all players have decided not to callout, end the callout
  if (deciding.length === 0) {
    const game = await getGame(user.gameTitle, gameID);
    await endCallout(game);
  }
};

export const startCalloutPeriod = async (user, game) => {
  if (user) {
    game = await getGame(user.gameTitle, user.gameID);
  }

  const gameID = game.gameID;

  if (!user || inProgressGameStatuses[gameID].activePlayer === user.username) {
    // Clear the interval
    clearInterval(inProgressGameStatuses[gameID].interval);
    // Reset the game status object's interval (but not the calloutTime)
    inProgressGameStatuses[gameID].interval = null;

    startCallout(game);
  }
};
