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
//     blockingRole: String,
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
//     displayLoseButtons: Boolean,
//   },

//   exchangeRoles: Array,
// };

import { getSocket } from "../utils/socketUtils.js";
import { getGame, updateUserAndGame } from "../utils/dbUtils.js";
import { loseRoleAuto, switchRole } from "./loseSwapRoles.js";
import {
  challengeTimeout,
  selectActionTimeout,
  loseSwapRolesTimeout,
  completeActionTimeout,
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

const updatePeriod = 100; // 100ms

export const turnExists = (gameID) => {
  if (turns[gameID]) {
    return true;
  } else {
    return false;
  }
};

export const getTurnProp = (gameID, prop) => {
  const turn = turns[gameID];
  if (turn) {
    return turn[prop];
  }
};

export const turnToString = (gameID) => {
  const turn = turns[gameID];
  const turnWithoutInterval = { ...turn, interval: undefined };

  return turnWithoutInterval;
};

const sendTurnUpdates = (game) => {
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
        clearInterval(turn.interval);
      }
      // Set the key's new value
      turn[key] = value;
    }

    // Update sockets with new turn
    sendTurnUpdates(game);
  }
};

export const startNewStage = async (game) => {
  const stage = getTurnProp(game.gameID, "stage");

  let challenging;

  let timeRemMS;
  switch (stage) {
    case "selectAction":
    case "completeAction":
      timeRemMS = 15000;
      break;
    case "blockAction":
      const action = getTurnProp(game.gameID, "action");
      if (action === "foreignAid") {
        const player = getTurnProp(game.gameID, "player");
        challenging = game.players.filter(
          (gamePlayer) => gamePlayer !== player
        );
      } else {
        const attackedPlayer = getTurnProp(game.gameID, "attacking");
        challenging = [attackedPlayer];
      }
      // console.log(`blockAction started, challenging: ${challenging}`);
      timeRemMS = 10000;
      setTurn(game, { timeRemMS: timeRemMS, challenging: challenging });
      break;
    case "challengeRole":
      const target = getTurnProp(game.gameID, "target");
      timeRemMS = 10000;
      challenging = game.players.filter(
        (gamePlayer) => gamePlayer !== target.target
      );
      setTurn(game, { timeRemMS: timeRemMS, challenging: challenging });
      break;
    case "loseSwapRoles":
      timeRemMS = 10000;
      setTurn(game, { timeRemMS: timeRemMS });
      const loseSwap = getTurnProp(game.gameID, "loseSwap");
      let stageEnding;
      // Handle swapping role
      const swapping = loseSwap.swapping;
      if (swapping && swapping.player) {
        stageEnding = await switchRole(game, swapping.player, swapping.role);
        if (stageEnding) {
          return;
        }
      }
      // Handle losing role(s)
      const losing = loseSwap.losing;
      if (losing && losing.player) {
        stageEnding = await loseRoleAuto(game, losing.player);
        if (stageEnding) {
          return;
        }
      }
      setTurn(game, { displayLoseButtons: true });
      break;
    default:
      throw `Not valid turn stage for gameID ${game.gameID}`;
  }

  setTurn(game, { timeRemMS: timeRemMS });

  const timeRem = () => {
    return getTurnProp(game.gameID, "timeRemMS");
  };

  const interval = setInterval(async () => {
    // Update the timeRem
    setTurn(game, { timeRemMS: timeRem() - updatePeriod });

    // Timeout Handler
    if (timeRem() === 0) {
      switch (stage) {
        case "selectAction":
          selectActionTimeout(game);
          break;
        case "challengeRole":
          challengeTimeout(game);
          break;
        case "loseSwapRoles":
          loseSwapRolesTimeout(game);
          break;
        case "completeAction":
          completeActionTimeout(game);
          break;
        case "blockAction":
          endStage(game);
          break;
        default:
          throw `${stage} not valid in timeoutHandler`;
      }
    }
  }, updatePeriod);

  // Set new interval (after interval declared) -> clears the old interval
  setTurn(game, { interval: interval });
};

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

export const endTurn = async (game) => {
  deleteTurn(game.gameID);

  const activePlayer = game.players.shift(); // Pop off the queue
  game.players.push(activePlayer); // Push player to end of queue

  await updateUserAndGame(activePlayer, game, "updateGame"); // Update the game (So turn order is saved)
  const updatedGame = await getGame(game.gameTitle, game.gameID); // Get the updated game

  createTurn(updatedGame);
};

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

export const createTurn = (game) => {
  const turn = turns[game.gameID];

  if (!turn) {
    // Create a new turn object if game isn't in progress (in memory)

    turns[game.gameID] = {
      timeRemMS: null,
      interval: null,
      stage: "selectAction", // non-null

      player: game.players[0], // non-null
      action: null,
      attacking: null,

      actionSuccess: true, // non-null
      assassinating: null,

      target: null,
      challenging: null,

      loseSwap: {
        losing: null,
        swapping: null,
      },
      displayLoseButtons: false,

      exchangeRoles: null,
    };

    startNewStage(game);
  }
};
