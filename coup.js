import { gameCollection, io } from "./index.js";
import { CoupGame } from "./schemas.js";
import * as dbUtils from "./dbUtils.js";
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

export const createGame = async (userObj, privacy, maxPlayers) => {
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
    maxPlayers: maxPlayers,
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

  const committed = await dbUtils.updateUserAndGame(user, game);
  if (committed) {
    // Add game to memory
    games.add(game);
  }
};

export const deleteGame = async (userObj) => {
  // Get the game
  const game = await CoupGame.findOne({
    gameID: userObj.gameID,
  }).exec();

  const committed = await dbUtils.updateUserAndGame(
    userObj.username,
    game,
    true
  );
  if (committed) {
    // Delete game from memory
    games.forEach((gameInSet) => {
      if (gameInSet.gameID === game.gameID) {
        games.delete(gameInSet);
      }
    });
  }
};

export const joinGame = async (userObj, gameID) => {
  // Get the game
  const game = await CoupGame.findOne({
    gameID: gameID,
  });

  // If space for a joining player
  if (game.maxPlayers > game.players.length) {
    const user = userObj.username;
    const pStat = { coins: 2, roles: ["", ""] };

    // Update players
    game.players.push(user);
    // Update pStats
    game.pStats[user] = pStat;

    const committed = await dbUtils.updateUserAndGame(user, game);
    if (committed) {
      // Update game in memory
      let gameToDelete;
      games.forEach((gameInSet) => {
        if (gameInSet.gameID === game.gameID) {
          gameToDelete = gameInSet;
        }
      });
      if (gameToDelete) {
        games.delete(gameToDelete);
        games.add(game);
      }
    }
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

  socket.on("coup createGame", async (privacy, maxPlayers) => {
    await createGame(socket.request.user, privacy, maxPlayers);
    socket.request.user = await dbUtils.getUserObj(
      socket.request.user.username
    ); // Update the socket's user object
    sendGames();
  });

  socket.on("coup deleteGame", async () => {
    await deleteGame(socket.request.user);
    socket.request.user = await dbUtils.getUserObj(
      socket.request.user.username
    ); // Update the socket's user object
    sendGames();
  });

  socket.on("coup joinGame", async (gameID) => {
    await joinGame(socket.request.user, gameID);
    socket.request.user = await dbUtils.getUserObj(
      socket.request.user.username
    ); // Update the socket's user object
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
