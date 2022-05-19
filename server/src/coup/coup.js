import { io } from "../index.js";
import { CoupGame } from "../schemas.js";
import { allOnlinePlayers } from "../utils/socketUtils.js";
// Coup Modules
import { createGame } from "./createGame.js";
import { deleteGame } from "./deleteGame.js";
import { joinGame } from "./joinGame.js";
import { leaveGame } from "./leaveGame.js";
import { getGameState, publicGameState } from "./getGameState.js";
import { income } from "./income.js";
import { preCalloutForeignAid } from "./foreignAid.js";
import { noCallout } from "./noCallout.js";
import { preCalloutTax } from "./tax.js";
import { callout } from "./callout.js";

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

const playerOnlineHandler = async (socket) => {
  addPlayer(socket.request.user.username);
  sendOnline();
};

const playerOfflineHandler = (socket) => {
  removePlayer(socket.request.user.username);
  sendOnline();
};

export const getPublicGame = (game, username) => {
  return publicGameState(game, username);
};

export const eventSwitch = async (event, socket, ...args) => {
  const user = socket.request.user;
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
      await playerOnlineHandler(socket);
      break;
    case "playerOffline":
      playerOfflineHandler(socket);
      break;
    case "getGameState":
      getGameState(socket);
      break;
    case "income":
      income(user);
      break;
    case "foreignAid":
      preCalloutForeignAid(user);
      break;
    case "tax":
      preCalloutTax(user);
      break;
    case "noCallout":
      noCallout(user);
      break;
    case "callout":
      const target = args[0];
      callout(user, target);
      break;
    default:
      throw "Not a valid 'coup' event";
  }
};
