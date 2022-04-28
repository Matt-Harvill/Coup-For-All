import { CoupGame } from "./schemas.js";

export default function gameSchemaSwitch(gameTitle) {
  switch (gameTitle) {
    case "coup":
      return CoupGame;
    default:
      break;
  }
}
