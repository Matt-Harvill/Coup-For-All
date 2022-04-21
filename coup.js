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
  const currGameStatus = userObj.gameStatus;
  if (currGameStatus !== "completed" && currGameStatus !== "") {
    // Only create a new game if user's currGame is complete or empty
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

export const deleteGame = async (userObj) => {
  try {
    const game = await utils.getCoupGame(userObj.gameID);

    // Delete game from database
    utils.deleteCoupGame(userObj.gameID);
    // Update user in database
    await utils.updateUser(userObj.username, "", "", "", {});

    // Delete game from memory
    games.forEach((gameInSet) => {
      if (gameInSet.gameID === game.gameID) {
        games.delete(gameInSet);
      }
    });
  } catch (error) {
    console.log(error);
  }
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
    socket.request.user = await utils.getUserObj(socket.request.user.username); // Update the socket's user object
    sendGames();
  });

  socket.on("coup deleteGame", async () => {
    await deleteGame(socket.request.user);
    socket.request.user = await utils.getUserObj(socket.request.user.username); // Update the socket's user object
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
    action(socket.request.user.username, action, target);
  });
};
