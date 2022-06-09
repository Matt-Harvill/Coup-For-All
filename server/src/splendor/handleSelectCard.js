import { getGame } from "../utils/dbUtils.js";
import { setTurn } from "./turns.js";

export const handleSelectCard = async (user, cardID) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    setTurn(game, { selectedCardID: cardID });
  }
};
