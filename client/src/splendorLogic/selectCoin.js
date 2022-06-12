import { socket } from "../socket";

export const coinSelected = (
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
