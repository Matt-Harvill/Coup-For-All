import { getGame } from "../utils/dbUtils.js";
import { endStage, getTurnProp, setTurn } from "./inProgressTurns.js";

export const callout = async (user, target) => {
  const game = await getGame(user.gameTitle, user.gameID);

  const caller = getTurnProp(game.gameID, "caller");

  // Only allow setting caller if its not already set
  if (!caller) {
    // Update the caller object
    setTurn(game, {
      caller: {
        caller: user.username,
        target: target,
      },
    });

    // End the callout stage
    endStage(game);
  }
};
