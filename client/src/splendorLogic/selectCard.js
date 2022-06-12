import { socket } from "../socket";

export const canSelectCard = (cardGroup, turnAction) => {
  switch (turnAction) {
    // reserveCard, buyCard, selectNoble
    case "reserveCard":
    case "buyCard":
      if (cardGroup === "activeCard" || cardGroup === "inactiveCard") {
        return true;
      } else {
        return false;
      }
    case "selectNoble":
      if (cardGroup === "nobleCard") {
        return true;
      } else {
        return false;
      }
    default:
      return false;
  }
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
