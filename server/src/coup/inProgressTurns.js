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
// },
import { inspect } from "util";
// import { getSocket } from "../utils/socketUtils";
// import { getGame, updateUserAndGame } from "../utils/dbUtils.js";

// Store the inProgress games' turn stagees (mapped by gameID)
const turns = {};

// Return a specific prop from the turn
export const getTurnProp = (gameID, prop) => {
  const turn = turns[gameID];
  if (turn) {
    return turn[prop];
  }
};

// Return the turn's toString (by gameID)
export const turnToString = (gameID) => {
  return inspect(turns[gameID]);
};

// Send turn to all sockets in the game
const sendTurnUpdates = (game) => {
  // Update players with updated turn
  for (const player of game.players) {
    let socket;
    // const socket = getSocket(player); // Get all the sockets of players in the game
    if (socket) {
      socket.emit("coup", "turnState", game.gameID, turnToString());
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

// Resume turn in preCallout stage
const preCallout = (game) => {
  const timeRem = () => {
    return getTurnProp(game.gameID, "timeRemMS");
  };

  // If the timeRemMS is null/undefined, set it to 60000 (60s)
  if (!timeRem()) {
    setTurn(game, { timeRemMS: 60000 });
  }

  const updatePeriod = 100; // Update every 100ms

  const interval = setInterval(async () => {
    // Update the timeRem
    setTurn(game, { timeRemMS: timeRem() - updatePeriod });

    // Print the timeRem
    console.log("timeRem:", timeRem());

    // If no time left, just end player's turn (for now)
    if (timeRem() === 0) {
      endTurn(game);
    }
  }, updatePeriod);

  // Set new interval (after interval declared)
  setTurn(game, { interval: interval });
};

// Resume the turn (by game)
export const resumeTurn = (game) => {
  // Check what stage the turn is in (switch for stage)
  switch (getTurnProp(game.gameID, "stage")) {
    case "preCallout":
      preCallout(game);
      break;
    case "callout":
      // callout(game);
      break;
    case "postCallout":
      // postCallout(game);
      break;
    default:
      throw `resumeTurn error for gameID: ${game.gameID}`;
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
  const interval = turns[gameID].interval;
  if (interval) {
    clearInterval(interval);
  }
  delete turns[gameID];
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
    };
    // Resume the turn
    resumeTurn(game);
  }
};
