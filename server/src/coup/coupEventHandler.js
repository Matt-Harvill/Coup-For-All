import { io } from "../index.js";
import { CoupGame } from "../schemas.js";
import { allOnlinePlayers } from "../utils/socketUtils.js";
// Coup Modules
import { createGame } from "./createGame.js";
import { deleteGame } from "./deleteGame.js";
import { joinGame } from "./joinGame.js";
import { leaveGame } from "./leaveGame.js";
import { getGameState, publicGameState } from "./getGameState.js";
import { selectAndCompleteIncome } from "./actions/income.js";
import { selectForeignAid } from "./actions/foreignAid.js";
import { noChallengeRole } from "./noChallengeRole.js";
import { selectTax } from "./actions/tax.js";
import { challengeRole } from "./challengeRole.js";
import { loseRole } from "./loseRole.js";
import {
  blockAssassinate,
  blockForeignAid,
  blockSteal,
} from "./blockActions.js";
import { selectAndCompleteCoup } from "./actions/coup.js";
import { completeExchange, selectExchange } from "./actions/exchange.js";
import { selectSteal } from "./actions/steal.js";
import { selectAssassinate } from "./actions/assassinate.js";

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

const chatHandler = (username, message) => {
  io.emit("coup", "chat", username, message);
};

const playerOnlineHandler = async (username) => {
  addPlayer(username);
  sendOnline();
};

const playerOfflineHandler = (username) => {
  removePlayer(username);
  sendOnline();
};

export const getPublicGame = (game, username) => {
  return publicGameState(game, username);
};

export const eventSwitch = async (event, socket, ...args) => {
  const user = socket.request.user;
  if (!user) {
    return;
  }

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
      chatHandler(user.username, message);
      break;
    case "formingGames":
      sendFormingGames();
      break;
    case "playerOnline":
      await playerOnlineHandler(user.username);
      break;
    case "playerOffline":
      playerOfflineHandler(user.username);
      break;
    case "getGameState":
      getGameState(socket);
      break;
    case "income":
      selectAndCompleteIncome(user);
      break;
    case "foreignAid":
      selectForeignAid(user);
      break;
    case "tax":
      selectTax(user);
      break;
    case "coup":
      const [coupTarget, coupRole] = args;
      selectAndCompleteCoup(user, coupTarget, coupRole);
      break;
    case "steal":
      const stealTarget = args[0];
      selectSteal(user, stealTarget);
      break;
    case "assassinate":
      const assassinateTarget = args[0];
      selectAssassinate(user, assassinateTarget);
      break;
    case "exchange":
      selectExchange(user);
      break;
    case "exchangeRoles":
      const roles = args;
      completeExchange(user, roles);
      break;
    case "noChallengeRole":
      noChallengeRole(user);
      break;
    case "challengeRole":
      const target = args[0];
      challengeRole(user, target);
      break;
    case "loseRole":
      const role = args[0];
      // Only need user and role for this loseRole call
      loseRole(user, role, null, null, null);
      break;
    case "blockAction":
      const action = args[0];
      switch (action) {
        case "foreignAid":
          blockForeignAid(user);
          break;
        case "steal":
          const role = args[1];
          blockSteal(user, role);
        case "assassinate":
          blockAssassinate(user);
          break;
        default:
          throw `${action} is not a valid 'coup' blockAction event`;
      }
      break;
    default:
      throw `${event} is not a valid 'coup' event`;
  }
};
