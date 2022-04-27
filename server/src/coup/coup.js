import { io } from "../index.js";
import { CoupGame } from "../schemas.js";
import * as dbUtils from "../dbUtils.js";
import { socketIDMap } from "../index.js";
import * as socketUtils from "../socketUtils.js";
import { allOnlinePlayers } from "../allOnlinePlayers.js";
// Coup Modules
import { createGame } from "./createGame.js";
import { deleteGame } from "./deleteGame.js";
import { joinGame } from "./joinGame.js";
import { leaveGame } from "./leaveGame.js";
import { publicGameState } from "./publicGameState.js";

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

const addPlayer = (user) => {
  coupOnlinePlayers.add(user);
};

const removePlayer = (user) => {
  coupOnlinePlayers.delete(user);
};

const sendFormingGames = () => {
  io.emit("coup", "formingGames", Array.from(coupFormingGames));
};

const sendOnline = () => {
  io.emit("coup", "online", Array.from(coupOnlinePlayers));
};

const leaveGameHandler = async (socket) => {
  await leaveGame(socket.request.user);
  await socketUtils.updateUserSocketAndClient(socket);
  sendFormingGames();
};

const createGameHandler = async (socket, privacy, maxPlayers) => {
  await createGame(socket.request.user, privacy, maxPlayers);
  await socketUtils.updateUserSocketAndClient(socket);
  sendFormingGames();
};

const deleteGameHandler = async (socket) => {
  await deleteGame(socket.request.user);
  await socketUtils.updateUserSocketAndClient(socket);
  sendFormingGames();
};

const joinGameHandler = async (socket, gameID) => {
  const game = await joinGame(socket.request.user, gameID); // joinGame returns game if it filled
  // If game is filled now:
  if (game !== undefined) {
    // Loop through sockets of players in this game if it filled to update them -> status changed to "in progress"
    const players = game.players;
    for (let i = 0; i < players.length; i++) {
      const userSocketID = socketIDMap[players[i]];
      // If userSocketID is defined (will be undefined if user isn't currently connected)
      if (userSocketID !== undefined) {
        const userSocket = io.sockets.sockets.get(userSocketID);
        await socketUtils.updateUserSocketAndClient(userSocket); // Alert players of updates
      }
    }
  } else {
    // Just update the single player if it didn't fill the game
    await socketUtils.updateUserSocketAndClient(socket);
  }
  sendFormingGames();
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

const getGameStateHandler = async (socket) => {
  const username = socket.request.user.username;
  const gameID = socket.request.user.gameID;
  const game = await dbUtils.getGame(gameID);
  const publicGame = publicGameState(game, username);
  socket.emit("coup", "gameState", gameID, publicGame);
};

export const eventSwitch = async (event, socket, ...args) => {
  switch (event) {
    case "leaveGame":
      leaveGameHandler(socket);
      break;
    case "createGame":
      const privacy = args[0];
      const maxPlayers = args[1];
      createGameHandler(socket, privacy, maxPlayers);
      break;
    case "deleteGame":
      deleteGameHandler(socket);
      break;
    case "joinGame":
      const gameID = args[0];
      joinGameHandler(socket, gameID);
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
      getGameStateHandler(socket);
      break;
    default:
      throw "Not a valid 'coup' event";
  }
};
