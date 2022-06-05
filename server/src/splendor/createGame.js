import crypto from "crypto";
import { SplendorGame } from "../schemas.js";
import { updateUserAndGame } from "../utils/dbUtils.js";
import {
  sendFormingGames,
  splendorFormingGames,
} from "./splendorEventHandler.js";
import {
  get5Nobles,
  getNewLevel1Cards,
  getNewLevel2Cards,
  getNewLevel3Cards,
  getNewPStat,
} from "./splendorStartingItems.js";

export const createGame = async (socket, privacy, maxPlayers, maxPoints) => {
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
  const gameTitle = "splendor";
  const gameID = crypto.randomBytes(6).toString("hex");
  const newPStat = getNewPStat(user);
  const allLevel1Cards = getNewLevel1Cards();
  const allLevel2Cards = getNewLevel2Cards();
  const allLevel3Cards = getNewLevel3Cards();
  const nobles = get5Nobles();
  let numCoins;
  // Case maxPlayers to Number
  maxPlayers = Number(maxPlayers);
  switch (maxPlayers) {
    case 2:
      numCoins = 4;
      break;
    case 3:
      numCoins = 5;
      break;
    case 4:
      numCoins = 7;
      break;
    default:
      break;
  }

  const game = new SplendorGame({
    gameTitle: gameTitle,
    gameID: gameID,
    founder: user,
    status: "forming", // 'forming', 'in progress', 'completed'
    privacy: privacy, // 'public', 'private'
    maxPoints: maxPoints,
    maxPlayers: maxPlayers,
    players: [user],
    pStats: [newPStat],
    activeCards: {
      level1: allLevel1Cards.slice(0, 4),
      level2: allLevel2Cards.slice(0, 4),
      level3: allLevel3Cards.slice(0, 4),
    },
    inactiveCards: {
      level1: allLevel1Cards.slice(4),
      level2: allLevel2Cards.slice(4),
      level3: allLevel3Cards.slice(4),
    },
    nobles: nobles,
    coins: {
      green: numCoins,
      blue: numCoins,
      red: numCoins,
      black: numCoins,
      white: numCoins,
      yellow: 5,
    },
    winner: null,
  });

  const committed = await updateUserAndGame(user, game, "updateGame");
  if (committed) {
    // Add game to memory
    splendorFormingGames.add(game);

    // Update everyone with new forming games
    sendFormingGames();
  }
};
