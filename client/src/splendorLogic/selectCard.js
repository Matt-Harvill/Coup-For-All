import { socket } from "../socket";

export const canSelectCard = (
  cardGroup,
  turnAction,
  playerCoins,
  requiredCoins
) => {
  switch (turnAction) {
    // reserveCard, buyCard, selectNoble
    case "reserveCard":
      if (cardGroup === "activeCard" || cardGroup === "inactiveCard") {
        return true;
      }
      break;
    case "buyCard":
      if (cardGroup === "activeCard") {
        let yellowsNeeded = 0;
        for (const [key, value] of Object.entries(playerCoins)) {
          const requiredValue = requiredCoins[key];
          if (requiredValue && value < requiredValue) {
            yellowsNeeded += requiredValue - value;
          }
        }
        // If the player doesn't have the required yellow coins to cover
        // deficiences, then they can't select this card
        if (yellowsNeeded > 0) {
          if (playerCoins["yellow"]) {
            if (yellowsNeeded <= playerCoins["yellow"]) {
              return true;
            }
          }
          return false;
        }
        return true;
      }
      break;
    case "selectNoble":
      if (cardGroup === "nobleCard") {
        return true;
      }
      break;
    default:
  }
  return false;
};

export const cardSelected = (
  cardAlreadySelected,
  cardID,
  cardGroup,
  turnPlayer,
  username,
  canSelect
) => {
  if (turnPlayer === username && canSelect) {
    if (cardAlreadySelected) {
      socket.emit("splendor", "selectCard", null, null); // Unselect the card
    } else {
      socket.emit("splendor", "selectCard", cardID, cardGroup); // select the card
    }
  }
};
