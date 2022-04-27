import { io } from "../index.js";
import { CoupGame } from "../schemas.js";
import { allOnlinePlayers } from "../utils/socketUtils.js";
// Coup Modules
import { createGame } from "./createGame.js";
import { deleteGame } from "./deleteGame.js";
import { joinGame } from "./joinGame.js";
import { leaveGame } from "./leaveGame.js";
import { getGameState } from "./getGameState.js";

// Set of coup players in lobby
const coupOnlinePlayers = new Set();
// Set of coup games forming in lobby
export const coupFormingGames = new Set();

// Add coupOnlinePlayers to allOnlinePlayers
allOnlinePlayers.set("coup", coupOnlinePlayers);

const getFormingGames = async () => {
  const dbGames = await CoupGame.find({ status: "forming" }).exec();
  if (dbGames) {
    dbGames.forEach((game) => {
      coupFormingGames.add(game);
    });
  }
};

// Get forming games on server start
getFormingGames();

const sendOnline = () => {
  io.emit("coup", "online", Array.from(coupOnlinePlayers));
};

const addPlayer = (user) => {
  coupOnlinePlayers.add(user);
  sendOnline();
};

const removePlayer = (user) => {
  coupOnlinePlayers.delete(user);
  sendOnline();
};

export const sendFormingGames = () => {
  io.emit("coup", "formingGames", Array.from(coupFormingGames));
};

const chatHandler = (socket, message) => {
  io.emit("coup", "chat", socket.request.user.username, message);
};

const playerOnlineHandler = (socket) => {
  addPlayer(socket.request.user.username);
  sendOnline();
};

const playerOfflineHandler = (socket) => {
  removePlayer(socket.request.user.username);
  sendOnline();
};

export const eventSwitch = async (event, socket, ...args) => {
  switch (event) {
    case "leaveGame":
      await leaveGame(socket);
      break;
    case "createGame":
      const [privacy, maxPlayers] = args;
      await createGame(socket, privacy, maxPlayers);
      break;
    case "deleteGame":
      await deleteGame(socket);
      break;
    case "joinGame":
      const gameID = args[0];
      await joinGame(socket, gameID);
      break;
    case "chat":
      const message = args[0];
      chatHandler(socket, message);
      break;
    case "formingGames":
      sendFormingGames();
      break;
    case "playerOnline":
      playerOnlineHandler(socket);
      break;
    case "playerOffline":
      playerOfflineHandler(socket);
      break;
    case "getGameState":
      getGameState(socket);
      break;
    default:
      throw "Not a valid 'coup' event";
  }
};
