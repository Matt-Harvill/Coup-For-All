import crypto from "crypto";
import * as dbUtils from "../utils/dbUtils.js";
import { CoupGame } from "../schemas.js";
import { coupFormingGames, sendFormingGames } from "./coupEventHandler.js";

export const createGame = async (socket, privacy, maxPlayers) => {
  const userObj = socket.request.user;
  if (!userObj) {
    return;
  }

  // Prevent user from creating multiple games
  const currGameStatus = userObj.gameStatus;
  if (currGameStatus !== "completed" && currGameStatus !== "") {
    // Only create a new game if user's currGame is complete or empty
    return;
  }

  const user = userObj.username;
  const gameTitle = "coup";
  const gameID = crypto.randomBytes(6).toString("hex");
  const pStat = {
    player: user,
    coins: 2,
    roles: ["", ""],
  };

  const pStats = [];
  pStats.push(pStat);

  const game = new CoupGame({
    gameTitle: gameTitle,
    gameID: gameID,
    founder: user,
    status: "forming", // 'forming', 'in progress', 'complete'
    privacy: privacy, // 'public', 'private'
    maxPlayers: maxPlayers,
    players: [user],
    outPlayers: [],
    pStats: pStats,
    availRoles: [
      "Ambassador",
      "Ambassador",
      "Ambassador",
      "Assassin",
      "Assassin",
      "Assassin",
      "Captain",
      "Captain",
      "Captain",
      "Contessa",
      "Contessa",
      "Contessa",
      "Duke",
      "Duke",
      "Duke",
    ],
    unavailRoles: {
      Ambassador: 0,
      Assassin: 0,
      Captain: 0,
      Contessa: 0,
      Duke: 0,
    },
    winner: null,
  });

  const committed = await dbUtils.updateUserAndGame(user, game, "updateGame");
  if (committed) {
    // Add game to memory
    coupFormingGames.add(game);

    // Update everyone with new forming games
    sendFormingGames();
  }
};
