import { coupDBUpdateTurnHandler } from "../coup/dbUpdateTurnHandler.js";
import { splendorDBUpdateTurnHandler } from "../splendor/dbUpdateTurnHandler.js";

export default async function dbTurnUpdateHandlerSwitch(
  game,
  gameTitle,
  updatedGame,
  update,
  username
) {
  switch (gameTitle) {
    case "coup":
      await coupDBUpdateTurnHandler(game, updatedGame, update, username);
      break;
    case "splendor":
      await splendorDBUpdateTurnHandler(game, updatedGame, update, username);
      break;
    default:
      throw `${gameTitle} not valid game title in dbTurnUpdateHandlerSwitch`;
  }
}
