import { socket } from "../socket";

export const canSelectCard = (cardType, turnAction) => {
  switch (turnAction) {
    // reserveCard, buyCard, selectNoble
    case "reserveCard":
    case "buyCard":
      if (cardType === "activeCard" || cardType === "inactiveCard") {
        return true;
      } else {
        return false;
      }
    case "selectNoble":
      if (cardType === "nobleCard") {
        return true;
      } else {
        return false;
      }
    default:
      return false;
  }
};

export const cardSelected = (cardID, turnPlayer, username, canSelect) => {
  if (turnPlayer === username && canSelect) {
    socket.emit("splendor", "selectCard", cardID);
  }
};
