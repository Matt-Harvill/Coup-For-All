import crypto from "crypto";
import { SplendorGame } from "../schemas.js";
import { updateUserAndGame } from "../utils/dbUtils.js";
import {
  sendFormingGames,
  splendorFormingGames,
} from "./splendorEventHandler.js";

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

  const game = new SplendorGame({
    gameTitle: gameTitle,
    gameID: gameID,
    founder: user,
    status: "forming", // 'forming', 'in progress', 'completed'
    privacy: privacy, // 'public', 'private'
    maxPoints: maxPoints,
    maxPlayers: maxPlayers, // 4
    players: [user],
    pStats: [
      {
        player: user,
        points: 0,
        permanentResources: {
          green: 0,
          blue: 0,
          red: 0,
          black: 0,
          white: 0,
        },
        coins: {
          green: 0,
          blue: 0,
          red: 0,
          black: 0,
          white: 0,
          yellow: 0,
        },
        cardsInHand: [],
        cardsOwned: [],
      },
    ],
    activeCards: {
      // Max 4 per level
      level1: [], // [SplendorCardSchema.obj]
      level2: [], // [SplendorCardSchema.obj]
      level3: [], // [SplendorCardSchema.obj]
    },
    inactiveCards: {
      // Remaining cards not owned yet, next card is popped off each level
      level1: [], // [SplendorCardSchema.obj]
      level2: [], // [SplendorCardSchema.obj]
      level3: [], // [SplendorCardSchema.obj]
    },
    nobles: [], // [SplendorNobleSchema.obj]
    coins: {}, // [...Splendor5ColorSchema.obj, yellow: Number]
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
