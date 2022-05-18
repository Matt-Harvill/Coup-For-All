import { getGame, updateUserAndGame } from "../utils/dbUtils.js";
import { startCalloutPeriod } from "./calloutPeriod.js";

export const foreignAid = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    // Add callout target
    game.calloutTargets.push({
      target: user.username,
      action: "foreignAid",
    });

    const committed = await updateUserAndGame(user, game, "updateGame");

    if (!committed) {
      console.log(
        "Error committing foreignAid calloutTarget for",
        user.username
      );
    } else {
      // Let others call out this player
      await startCalloutPeriod(user, null);
    }
  }
};
