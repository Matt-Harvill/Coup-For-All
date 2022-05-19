import * as turnStuff from "../coup/inProgressTurns.js";

const game = {
  gameTitle: "coup",
  gameID: "123412341234",
  founder: "matt",
  status: "forming",
  privacy: "public",
  maxPlayers: 6,
  players: ["matt", "john"],
  pStats: [
    {
      player: "matt",
      coins: 2,
      roles: ["AS", "CA"],
    },
    {
      player: "john",
      coins: 2,
      roles: ["CO", "D"],
    },
  ],
  availRoles: [],
  winner: "",
  availRoles: ["AM", "AS", "D"],
};

// const interval = setInterval(() => {
//   console.log("Interval console log");
// }, 1000);

const delay = async (ms) => {
  // return await for better async stack trace support in case of errors.
  return await new Promise((resolve) => setTimeout(resolve, ms));
};

// Print the turn before it is created
console.log("Turn before created\n", turnStuff.turnToString(game.gameID), "\n");

// Create the turn
turnStuff.createTurn(game);

// Print the turn after it is created
console.log("Turn after created\n", turnStuff.turnToString(game.gameID), "\n");

// Set some properties of the turn
// turnStuff.setTurn(game.gameID, { interval: interval, timeRemMS: 10000 });

// Print the turn after it is edited
// console.log("Turn after edited\n", turnStuff.turnToString(game.gameID), "\n");

// Wait 4s
await delay(4000);

// Delete the turn
turnStuff.deleteTurn(game.gameID);

// Print the turn after it is deleted
console.log("Turn after deleted\n", turnStuff.turnToString(game.gameID), "\n");

// Wait 2s
await delay(2000);
