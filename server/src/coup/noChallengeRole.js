import { getGame } from "../utils/dbUtils.js";
import { getTurnProp, setTurn } from "./inProgressTurns.js";
import { challengeTimeout } from "./timeouts.js";

export const noChallengeRole = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);
  const gameID = game.gameID;

  let challenging = getTurnProp(gameID, "challenging");
  // Remove player from challenging
  challenging = challenging.filter((undecidedPlayer) => {
    return undecidedPlayer !== user.username;
  });

  setTurn(game, { challenging: challenging });

  if (challenging.length === 0) {
    challengeTimeout(game);
  }
};
