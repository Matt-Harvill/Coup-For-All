import { getGame } from "../utils/dbUtils.js";
import { getTurnProp, setTurn } from "./inProgressTurns.js";
import { challengeTimeout } from "./timeouts.js";

export const noChallengeRole = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);
  const gameID = game.gameID;

  let deciding = getTurnProp(gameID, "deciding");
  // Remove player from still deciding
  deciding = deciding.filter((undecidedPlayer) => {
    return undecidedPlayer !== user.username;
  });

  // Update the deciding array
  setTurn(game, { deciding: deciding });

  if (deciding.length === 0) {
    challengeTimeout(game);
  }
};
