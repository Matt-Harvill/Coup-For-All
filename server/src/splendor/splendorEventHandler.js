import { io } from "../index.js";
import { SplendorGame } from "../schemas.js";
import { allOnlinePlayers } from "../utils/socketUtils.js";
// Splendor Modules
import { getSplendorGameState } from "./getGameState.js";
import { leaveGame } from "./leaveGame.js";
import { createGame } from "./createGame.js";
import { joinGame } from "./joinGame.js";
import { deleteGame } from "./deleteGame.js";

// Set of splendor players in lobby
const splendorOnlinePlayers = new Set();
// Set of splendor games forming in lobby
export const splendorFormingGames = new Set();

// Add splendorOnlinePlayers to allOnlinePlayers
allOnlinePlayers.set("splendor", splendorOnlinePlayers);

const getFormingGames = async () => {
  const dbGames = await SplendorGame.find({ status: "forming" }).exec();
  if (dbGames) {
    dbGames.forEach((game) => {
      splendorFormingGames.add(game);
    });
  }
};

// Get forming games on server start
getFormingGames();

const sendOnline = () => {
  io.emit("splendor", "online", Array.from(splendorOnlinePlayers));
};

const addPlayer = (user) => {
  splendorOnlinePlayers.add(user);
  sendOnline();
};

const removePlayer = (user) => {
  splendorOnlinePlayers.delete(user);
  sendOnline();
};

export const sendFormingGames = () => {
  io.emit("splendor", "formingGames", Array.from(splendorFormingGames));
};

const chatHandler = (username, message) => {
  io.emit("splendor", "chat", username, message);
};

const playerOnlineHandler = async (username) => {
  addPlayer(username);
  sendOnline();
};

const playerOfflineHandler = (username) => {
  removePlayer(username);
  sendOnline();
};

export const getPublicGame = (game, username) => {
  // No need to make any information hidden
  return game;
};

export const eventSwitch = async (event, socket, ...args) => {
  const user = socket.request.user;
  if (!user) {
    return;
  }

  switch (event) {
    case "leaveGame":
      leaveGame(socket);
      break;
    case "createGame":
      const [privacy, maxPlayers] = args;
      createGame(socket, privacy, maxPlayers);
      break;
    case "deleteGame":
      deleteGame(socket);
      break;
    case "joinGame":
      const gameID = args[0];
      joinGame(socket, gameID);
      break;
    case "chat":
      const message = args[0];
      chatHandler(user.username, message);
      break;
    case "formingGames":
      sendFormingGames();
      break;
    case "playerOnline":
      playerOnlineHandler(user.username);
      break;
    case "playerOffline":
      playerOfflineHandler(user.username);
      break;
    case "getGameState":
      getSplendorGameState(socket);
      break;
    default:
      throw `${event} is not a valid 'splendor' event`;
  }
};
