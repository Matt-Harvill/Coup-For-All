// Mapped by gameID
// turn = {
//   timeRemMS: String,
//   interval: Function,
//   stage: selectAction/selectNoble,
//   action: takeCoins, reserveCard, buyCard, selectNoble, null

//   selectedCardID: (need to add cardID for each card),
//   selectedCoins: {
//     green: Number,
//     blue: Number,
//     green: Number,
//     blue: Number,
//     green: Number,
//     yellow: Number,
//   }
// }
import { getSocket } from "../utils/socketUtils.js";
import { getGame, updateUserAndGame } from "../utils/dbUtils.js";
import { longTurnTime, shortTurnTime } from "./splendorTurnTimes.js";
import { selectActionTimeout, selectNobleTimeout } from "./splendorTimeouts.js";
import { checkCanGetNobles } from "./checkCanGetNobles.js";

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
  const allPlayers = game.players;
  for (const player of allPlayers) {
    const socket = getSocket(player); // Get all the sockets of players in the game
    if (socket) {
      socket.emit(
        "splendor",
        "updateTurn",
        game.gameID,
        turnToString(game.gameID)
      );
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

  let timeRemMS;

  switch (stage) {
    case "selectAction":
      timeRemMS = longTurnTime;
      break;
    case "selectNoble":
      timeRemMS = shortTurnTime;
      break;
    default:
      throw `Not valid splendor turn stage for gameID ${game.gameID}`;
  }

  setTurn(game, { timeRemMS: timeRemMS });

  const timeRem = () => {
    return getTurnProp(game.gameID, "timeRemMS");
  };

  const interval = setInterval(async () => {
    // Update the timeRem
    setTurn(game, { timeRemMS: timeRem() - updatePeriod });

    // Timeout Handler (Add some delay -300 instead of 0)
    if (timeRem() === -300) {
      switch (stage) {
        case "selectAction":
          selectActionTimeout(game);
          break;
        case "selectNoble":
          selectNobleTimeout(game);
          break;
        default:
          throw `${stage} not valid in splendor timeoutHandler`;
      }
    }
  }, updatePeriod);

  // Set new interval (after interval declared) -> clears the old interval
  setTurn(game, { interval: interval });
};

export const endStage = (game) => {
  const action = getTurnProp(game.gameID, "action");
  const stage = getTurnProp(game.gameID, "stage");

  if (stage) {
    switch (stage) {
      case "selectAction":
        checkCanGetNobles(game);
        break;
      case "selectNoble":
        endTurn(game);
        break;
      default:
        throw `${action} not valid (in splendor endStage)`;
    }
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
      player: game.players[0], // non-null
      stage: "selectAction", // non-null - can be selectAction/selectNoble
      action: null, // can be takeCoins, reserveCard, buyCard, selectNoble, null
      selectedCardID: null,
      selectedCoins: {
        green: 0,
        blue: 0,
        green: 0,
        blue: 0,
        green: 0,
        yellow: 0,
      },
    };

    startNewStage(game);
  }
};
