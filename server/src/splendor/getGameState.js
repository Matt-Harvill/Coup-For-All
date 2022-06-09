import { getGame } from "../utils/dbUtils.js";
import { createTurn } from "./turns.js";

export const getSplendorGameState = async (socket) => {
  const user = socket.request.user;
  if (!user) {
    return;
  }

  const game = await getGame(user.gameTitle, user.gameID);
  // Start the game's turns if it hasn't yet
  if (
    user.gameTitle &&
    user.gameID &&
    user.gameStatus &&
    user.gameStatus === "in progress"
  ) {
    // Will create a turn for splendor games in future
    createTurn(game);
  }

  socket.emit("splendor", "updateGame", user.gameID, game);
};
