import { coupDBUpdateTurnHandler } from "../coup/dbUpdateTurnHandler.js";
import { splendorDBUpdateTurnHandler } from "../splendor/dbUpdateTurnHandler.js";

export default async function dbTurnUpdateHandlerSwitch(
  game,
  gameTitle,
  updatedGame,
  update,
  user
) {
  switch (gameTitle) {
    case "coup":
      await coupDBUpdateTurnHandler(game, updatedGame, update, user);
      break;
    case "splendor":
      await splendorDBUpdateTurnHandler(game, updatedGame, update, user);
      break;
    default:
      throw `${gameTitle} not valid game title in dbTurnUpdateHandlerSwitch`;
  }
}
