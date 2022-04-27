import * as coup from "./coup.js";
import * as all from "./all.js";

export default function socketGroupSwitch(gameTitle) {
  switch (gameTitle) {
    case "coup":
      return coup;
    case "all":
      return all;
    default:
      break;
  }
}
