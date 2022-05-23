import { io } from "../index.js";
import { CoupGame } from "../schemas.js";
import { allOnlinePlayers } from "../utils/socketUtils.js";
// Coup Modules
import { createGame } from "./createGame.js";
import { deleteGame } from "./deleteGame.js";
import { joinGame } from "./joinGame.js";
import { leaveGame } from "./leaveGame.js";
import { getGameState, publicGameState } from "./getGameState.js";
import { selectIncome } from "./actions/income.js";
import { selectForeignAid } from "./actions/foreignAid.js";
import { noCallout } from "./noCallout.js";
import { preCalloutTax } from "./actions/tax.js";
import { callout } from "./callout.js";
import { loseRole } from "./loseRoles.js";
import { blockForeignAid, blockSteal } from "./blocks.js";
import { coupAction } from "./actions/coupAction.js";
import { exchangeRoles, preCalloutExchange } from "./actions/exchange.js";
import { preCalloutSteal } from "./actions/steal.js";

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
      selectIncome(user);
      break;
    case "foreignAid":
      selectForeignAid(user);
      break;
    case "tax":
      preCalloutTax(user);
      break;
    case "coupAction":
      const [coupTarget, coupRole] = args;
      coupAction(user, coupTarget, coupRole);
      break;
    case "steal":
      const stealTarget = args[0];
      preCalloutSteal(user, stealTarget);
      break;
    case "exchange":
      preCalloutExchange(user);
      break;
    case "exchangeRoles":
      const roles = args;
      exchangeRoles(user, roles);
      break;
    case "noCallout":
      noCallout(user);
      break;
    case "callout":
      const target = args[0];
      callout(user, target);
      break;
    case "loseRole":
      const role = args[0];
      // Only need user and role for this loseRole call
      loseRole(user, role, null, null, null);
      break;
    case "block":
      const action = args[0];
      switch (action) {
        case "foreignAid":
          blockForeignAid(user);
          break;
        case "steal":
          const role = args[1];
          blockSteal(user, role);
        default:
          break;
      }
      break;
    default:
      throw `${event} is not a valid 'coup' event`;
  }
};
