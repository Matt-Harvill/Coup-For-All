import { getGame } from "../utils/dbUtils.js";
import { endStage, getTurnProp, setTurn } from "./inProgressTurns.js";

export const noCallout = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);
  const gameID = game.gameID;

  let deciding = getTurnProp(gameID, "deciding");
  // Remove player from still deciding
  deciding = deciding.filter((undecidedPlayer) => {
    return undecidedPlayer !== user.username;
  });

  // Update the deciding array
  setTurn(game, { deciding: deciding });

  // If all players have decided not to callout, end the callout
  if (deciding.length === 0) {
    endStage(game);
  }
};
