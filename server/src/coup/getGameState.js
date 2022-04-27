import * as dbUtils from "../utils/dbUtils.js";
import { publicGameState } from "./publicGameState.js";

export const getGameState = async (socket) => {
  const username = socket.request.user.username;
  const gameID = socket.request.user.gameID;
  const game = await dbUtils.getGame(gameID);
  const publicGame = publicGameState(game, username);
  socket.emit("coup", "gameState", gameID, publicGame);
};
