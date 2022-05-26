import { CoupGame, SplendorGame } from "./schemas.js";

export default function gameSchemaSwitch(gameTitle) {
  switch (gameTitle) {
    case "coup":
      return CoupGame;
    case "splendor":
      return SplendorGame;
    default:
      break;
  }
}
