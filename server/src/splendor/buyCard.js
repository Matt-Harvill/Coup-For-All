import { getGame, updateUserAndGame } from "../utils/dbUtils";

const buyCard = (userObj, cardToBuy) => {
  const game = await getGame(userObj.gameTitle, userObj.gameID)

  if (!game) {
    return
  }
  // Carry out the functionality to buy a card

  // Check if player can get noble(s)
  // Do something if they can get multiple

  // You will have an updated game object

  const committed = await updateUserAndGame(user, game, "updateGame");

  if (!committed) {
    console.log(`Error buying card for ${userObj} in buyCard`)
  }
};
