import { io } from "./index.js";
import { CoupGame, User } from "./schemas.js";
import * as utils from "./utils.js";
import crypto from "crypto";
// Set of coup players in lobby
const players = new Set();
// Set of coup games forming in lobby
export const games = new Set();

const getFormingGames = async () => {
  const dbGames = await CoupGame.find({ status: "forming" }).exec();

  if (dbGames) {
    dbGames.forEach((game) => {
      games.add(game);
    });
  }
};

getFormingGames();

export const addPlayer = (user) => {
  players.add(user);
};

export const removePlayer = (user) => {
  players.delete(user);
};

export const action = (user, action, target) => {
  console.log(`${user} called ${action} on ${target}`);
};

export const createGame = async (userObj, privacy) => {
  // Prevent user from creating multiple games
  // console.log("userObj: ", userObj);
  const currGameStatus = userObj.gameStatus;
  // console.log(currGameStatus);
  if (currGameStatus !== "completed" && currGameStatus !== "") {
    return;
  }

  const user = userObj.username;
  const gameTitle = "coup";
  const gameID = crypto.randomBytes(6).toString("hex");
  const pStat = { coins: 2, roles: ["", ""] };

  const pStats = new Map();
  pStats.set(user, pStat);

  const game = new CoupGame({
    gameTitle: gameTitle,
    gameID: gameID,
    founder: user,
    status: "forming", // 'forming', 'in progress', 'complete'
    privacy: privacy, // 'public', 'private'
    players: [user],
    pStats: pStats,
    availRoles: [
      "AM",
      "AM",
      "AM",
      "AS",
      "AS",
      "AS",
      "CA",
      "CA",
      "CA",
      "CO",
      "CO",
      "CO",
      "D",
      "D",
      "D",
    ],
  });

  await utils.updateUserAndGame(user, game);
};

const sendGames = () => {
  // console.log(`Num games: ${games.size}`);
  io.emit("coup games", Array.from(games));
};

const sendOnline = () => {
  io.emit("coup online", Array.from(players));
};

export const socketInit = (socket) => {
  socket.on("coup chat", (message) => {
    io.emit("coup chat", socket.request.user.username, message);
  });

  socket.on("coup games", () => {
    sendGames();
  });

  socket.on("coup createGame", async (privacy) => {
    await createGame(socket.request.user, privacy);
    socket.request.user = await utils.getUserObj(socket.request.user.username); // Update the socket user object
    sendGames();
  });

  socket.on("coup addPlayer", () => {
    addPlayer(socket.request.user.username);
    sendOnline();
  });

  socket.on("coup removePlayer", () => {
    removePlayer(socket.request.user.username);
    sendOnline();
  });

  socket.on("coup action", (action, target) => {
    action(user, action, target);
  });
};
