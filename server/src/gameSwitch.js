import * as coup from "./coup/coup.js";
import * as all from "./all.js";

export default function gameSwitch(gameTitle) {
  switch (gameTitle) {
    case "coup":
      return coup;
    case "all":
      return all;
    default:
      break;
  }
}