import * as coup from "./coup.js";

export default function socketGameSwitch(gameTitle) {
  switch (gameTitle) {
    case "coup":
      return coup;

    default:
      break;
  }
}
