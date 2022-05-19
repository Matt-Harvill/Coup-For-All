// Mapped by gameID
// turn: {
//   player: String,
//   action: String,
//   timeRemMS: String,
//   interval: (),
//   stage: String, // Turn can be preCallout, callout, postCallout
//   targets: [
//     {
//       target: String,
//       action: String,
//     },
//   ],
//   roleSwitch: {
//     losing: null,
//     switching: null
//   }
//   deciding: [],
// },

import { getSocket } from "../utils/socketUtils.js";
import { getGame, updateUserAndGame } from "../utils/dbUtils.js";
import { postCalloutForeignAid } from "./foreignAid.js";
import { postCalloutTax } from "./tax.js";

// Store the inProgress games' turn stages (mapped by gameID)
const turns = {};

// Have an update period for all time updates
const updatePeriod = 100; // 100ms

// Return a specific prop from the turn
export const getTurnProp = (gameID, prop) => {
  const turn = turns[gameID];
  if (turn) {
    return turn[prop];
  }
};

// Return the turn's toString (by gameID)
export const turnToString = (gameID) => {
  const turn = turns[gameID];
  const turnWithoutInterval = { ...turn, interval: undefined };

  return turnWithoutInterval;
};

// Send turn to all sockets in the game
const sendTurnUpdates = (game) => {
  // Update players with updated turn
  for (const player of game.players) {
    const socket = getSocket(player); // Get all the sockets of players in the game
    if (socket) {
      socket.emit("coup", "updateTurn", game.gameID, turnToString(game.gameID));
    }
  }
};

// Set the turn (by game) with newStats: {...} and sendUpdates
export const setTurn = (game, newStats) => {
  const turn = turns[game.gameID];

  if (turn) {
    for (let [key, value] of Object.entries(newStats)) {
      if (key == "interval" && turn.interval) {
        // Clear the old interval
        clearInterval(turn.interval);
      }
      // Set the key's new value
      turn[key] = value;
    }

    // Update sockets with new turn
    sendTurnUpdates(game);
  }
};

// Handle starting a new stage
const startNewStage = (game) => {
  const stage = getTurnProp(game.gameID, "stage");

  let timeRemMS;
  switch (stage) {
    case "preCallout":
    case "postCallout":
      timeRemMS = 30000;
      break;
    case "callout":
    case "roleSwitch":
      timeRemMS = 15000;
      break;
    default:
      throw `Not valid turn stage for gameID ${game.gameID}`;
  }

  // Set timeRem
  setTurn(game, { timeRemMS: timeRemMS });

  // Return the turn's timeRem
  const timeRem = () => {
    return getTurnProp(game.gameID, "timeRemMS");
  };

  const interval = setInterval(async () => {
    // Update the timeRem
    setTurn(game, { timeRemMS: timeRem() - updatePeriod });

    // Go to next stage when time runs out
    if (timeRem() === 0) {
      endStage(game);
    }
  }, updatePeriod);

  // Set new interval (after interval declared) -> clears the old interval
  setTurn(game, { interval: interval });
};

// Handle preCallout stage ending
const preCalloutOver = (game) => {
  const action = getTurnProp(game.gameID, "action");

  switch (action) {
    case "":
    case "income":
      endTurn(game);
      break;
    case "foreignAid":
    case "tax":
    case "assassinate":
    case "exchange":
    case "steal":
    case "coup":
      setTurn(game, { stage: "callout" });
      startNewStage(game);
      break;
    default:
      throw `Not valid action in preCalloutOver for gameID ${game.gameID}`;
  }
};

// Handle callout stage ending
const calloutOver = (game) => {
  const action = getTurnProp(game.gameID, "action");

  const roleSwitch = getTurnProp(game.gameID, "roleSwitch");
  if (roleSwitch && (roleSwitch.losing || roleSwitch.switching)) {
    // Do roleSwitch stuff
    setTurn(game, { stage: "roleSwitch" });
    startNewStage(game);
    return;
  }

  switch (action) {
    case "foreignAid":
      postCalloutForeignAid(game);
      break;
    case "tax":
      postCalloutTax(game);
      break;
    case "assassinate":
    case "steal":
    case "coup":
      endStage(game);
      break;
    case "exchange":
      // Do postCallout stuff
      setTurn(game, { stage: "postCallout" });
      startNewStage(game);
      break;
    default:
      throw `Not valid action in calloutOver for gameID ${game.gameID}`;
  }
};

// Handle callout stage ending
// const roleSwitchOver = (game) => {
//   // For now just automatically go to postCallout
//   setTurn(game, { stage: "postCallout" });
//   startNewStage(game);
// };

// End the current stage and start the next
export const endStage = (game) => {
  const stage = getTurnProp(game.gameID, "stage");

  switch (stage) {
    case "preCallout":
      // Starts the new stage after updating it
      preCalloutOver(game);
      break;
    case "callout":
      // Starts the new stage after updating it
      calloutOver(game);
      break;
    case "roleSwitch":
      // Indicate in calloutOver to go to postCallout (losing and switching has been handled)
      setTurn(game, { roleSwitch: null });
      calloutOver(game);
      break;
    case "postCallout":
      // Starts the new stage after updating it
      endTurn(game);
      break;
    default:
      throw `Not valid turn stage for gameID ${game.gameID}`;
  }
};

// End the turn (by game)
export const endTurn = async (game) => {
  // Delete the current turn
  deleteTurn(game.gameID);

  const activePlayer = game.players.shift(); // Pop off the queue
  game.players.push(activePlayer); // Push player to end of queue

  await updateUserAndGame(activePlayer, game, "updateGame"); // Update the game (So turn order is saved)
  const updatedGame = await getGame(game.gameTitle, game.gameID); // Get the updated game

  // Create a new turn with the updated game
  createTurn(updatedGame);
};

// Delete the turn (by gameID)
export const deleteTurn = (gameID) => {
  const turn = turns[gameID];

  if (turn) {
    const interval = turn.interval;
    if (interval) {
      clearInterval(interval);
    }
    delete turns[gameID];
  }
};

// Create the turn (by game)
export const createTurn = (game) => {
  const turn = turns[game.gameID];

  if (!turn) {
    // Create a new turn object if game isn't in progress (in memory)
    turns[game.gameID] = {
      player: game.players[0],
      action: "",
      timeRemMS: null,
      interval: null,
      stage: "preCallout",
      targets: [],
      roleSwitch: {
        losing: null,
        switching: null,
      },
    };

    // Start the turn (in preCallout)
    startNewStage(game);
  }
};
