import crypto from "crypto";
import * as dbUtils from "../utils/dbUtils.js";
import { CoupGame } from "../schemas.js";
import { coupFormingGames, sendFormingGames } from "./coup.js";

export const createGame = async (socket, privacy, maxPlayers) => {
  const userObj = socket.request.user;

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

  const committed = await dbUtils.updateUserAndGame(user, game, "createGame");
  if (committed) {
    // Add game to memory
    coupFormingGames.add(game);

    // Update everyone with new forming games
    sendFormingGames();
  }
};
