// Mapped by gameID
// let turn = {
//   timeRemMS: String,
//   interval: Function,
//   stage: String, // selectAction, challengeRole, blockAction, loseSwapRoles, completeAction

//   player: String,
//   action: String,
//   attacking: String,

//   actionSuccess: Boolean,
//   assassinating: Boolean,

//   target: {
//     target: String,
//     action: String,
//     attacking: String,
//   },
//   challenging: Array,

//   loseSwap: {
//     losing: {
//       player: String,
//       role: String,
//     },
//     swapping: {
//       player: String,
//       role: String,
//     },
//   },

//   exchangeRoles: Array,
// };

import { getSocket } from "../utils/socketUtils.js";
import { getGame, updateUserAndGame } from "../utils/dbUtils.js";
import { loseRoleAuto, switchRole } from "./loseSwaping.js";
import {
  challengeTimeout,
  selectActionTimeout,
  loseSwapRolesTimeout,
} from "./timeouts.js";
import { incomeEndStage } from "./actions/income.js";
import { foreignAidEndStage } from "./actions/foreignAid.js";
import { taxEndStage } from "./actions/tax.js";
import { exchangeEndStage } from "./actions/exchange.js";
import { coupEndStage } from "./actions/coup.js";
import { stealEndStage } from "./actions/steal.js";
import { assassinateEndStage } from "./actions/assassinate.js";

// Store the inProgress games' turn stages (mapped by gameID)
const turns = {};

// Have an update period for all time updates
const updatePeriod = 100; // 100ms

// See if turn exists
export const turnExists = (gameID) => {
  if (turns[gameID]) {
    return true;
  } else {
    return false;
  }
};

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
  const allPlayers = game.players.concat(game.outPlayers);
  for (const player of allPlayers) {
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
export const startNewStage = async (game) => {
  const stage = getTurnProp(game.gameID, "stage");

  let timeRemMS;
  switch (stage) {
    case "selectAction":
    case "completeAction":
      timeRemMS = 60000;
      break;
    case "blockAction":
      timeRemMS = 30000;
      break;
    case "challengeRole":
      timeRemMS = 30000;
      const deciding = getTurnProp(game.gameID, "deciding");
      if (deciding.length === 0) {
        // Go to next stage if no one to call out
        // Set the timeRemMS (So time bar doesn't look weird)
        setTurn(game, { timeRemMS: timeRemMS });
        endStage(game);
        return;
      }
      break;
    case "loseSwap":
      timeRemMS = 30000;
      setTurn(game, { timeRemMS: timeRemMS });
      const loseSwap = getTurnProp(game.gameID, "loseSwap");
      let stageEnding;
      // Handle switching role
      const switching = loseSwap.switching;
      if (switching && switching.player) {
        stageEnding = await switchRole(game, switching.player, switching.role);
        if (stageEnding) {
          return;
        }
      }
      // Handle losing role(s)
      const losing = loseSwap.losing;
      if (losing && losing.player) {
        stageEnding = await loseRoleAuto(game, losing.player, losing.numRoles);
        if (stageEnding) {
          return;
        }
      }
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

    // console.log("interval stage:", stage);

    // Handle when time runs out
    if (timeRem() === 0) {
      switch (stage) {
        case "selectAction":
          selectActionTimeout(game);
          break;
        case "blockAction":
        case "challengeRole":
          challengeTimeout(game);
          break;
        case "loseSwap":
          loseSwapRolesTimeout(game);
          break;
        default:
          endStage(game);
          break;
      }
    }
  }, updatePeriod);

  // Set new interval (after interval declared) -> clears the old interval
  setTurn(game, { interval: interval });
};

// End the current stage and start the next
export const endStage = (game) => {
  const action = getTurnProp(game.gameID, "action");
  const stage = getTurnProp(game.gameID, "stage");

  switch (action) {
    case "income":
      incomeEndStage(game, stage);
      break;
    case "foreignAid":
      foreignAidEndStage(game, stage);
      break;
    case "tax":
      taxEndStage(game, stage);
      break;
    case "exchange":
      exchangeEndStage(game, stage);
      break;
    case "coup":
      coupEndStage(game, stage);
      break;
    case "steal":
      stealEndStage(game, stage);
      break;
    case "assassinate":
      assassinateEndStage(game, stage);
      break;
    default:
      throw `${action} not valid (in endStage)`;
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
      action: null,
      attacking: null,
      actionSuccess: true,
      timeRemMS: null,
      interval: null,
      stage: "selectAction",
      target: null,
      loseSwap: {
        losing: null,
        switching: null,
      },
      exchangeRoles: null,
    };

    // Start the turn (in selectAction)
    startNewStage(game);
  }
};
