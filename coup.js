import { io } from "./index.js";
import { CoupGame } from "./schemas.js";
import crypto from "crypto";
let players = new Set();
let games = new Set();

// Keep a list of the active coup games after initial database grab
// This will be similar to the list of players that is stored in memory
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

export const createGame = (user, privacy) => {
  const gameID = crypto.randomBytes(6).toString("hex");

  const game = new CoupGame({
    gameTitle: "coup",
    gameID: gameID,
    founder: user,
    status: "forming", // 'forming', 'in progress', 'complete'
    privacy: privacy, // 'public', 'private'
    players: [user],
    pStats: { user: { coins: 2, roles: ["", ""] } },
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
  game.save();
  games.add(game);
};

const sendGames = () => {
  console.log(`Num games: ${games.size}`);
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

  socket.on("coup createGame", (privacy) => {
    createGame(socket.request.user.username, privacy);
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
