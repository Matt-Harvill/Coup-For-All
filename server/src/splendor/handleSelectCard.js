import { getGame } from "../utils/dbUtils.js";
import { getCardFromID } from "./cardIDUtils.js";
import { setTurn } from "./turns.js";

export const handleSelectCard = async (user, cardID, cardGroup) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    setTurn(game, { selectedCardID: cardID, selectedCardGroup: cardGroup });
  }

  // if (cardID) {
  //   const card = getCardFromID(cardID, cardGroup, game);
  //   console.log(card);
  // }
};
