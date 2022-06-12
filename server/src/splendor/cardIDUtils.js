export const getCardFromID = (cardID, cardGroup, game) => {
  switch (cardGroup) {
    case "activeCard":
      for (const [level, cardArray] of Object.entries(game.activeCards)) {
        for (const card of cardArray) {
          if (card && card._id.toString() === cardID) {
            return card;
          }
        }
      }
      break;
    case "inactiveCard":
      return game.inactiveCards[cardID].shift(); // cardID is the level, get first card
      break;
    case "nobleCard":
      for (const card of game.nobles) {
        if (card._id.toString() === cardID) {
          return card;
        }
      }
      break;

    default:
      throw `${cardGroup} invalid card group (splendor)`;
  }
};

export const filterCardFromID = (cardID, cardGroup, game) => {
  switch (cardGroup) {
    case "activeCard":
      for (let [level, cardArray] of Object.entries(game.activeCards)) {
        let newCard, cardToRemove;
        for (let card of cardArray) {
          if (card && card._id.toString() === cardID) {
            // This card will be removed, add the next inactiveCard in its place
            if (game.inactiveCards[level].length > 0) {
              newCard = game.inactiveCards[level].shift(); // Remove first inactiveCard and set it in game activeCards
            }
            cardToRemove = card;
          }
        }
        if (cardToRemove) {
          const cardToRemoveIndex = cardArray.indexOf(cardToRemove);
          cardArray[cardToRemoveIndex] = newCard;
        }
        // if (newCard) {
        //   const cardToRemoveIndex = cardArray.indexOf(cardToRemove);
        //   cardArray[cardToRemoveIndex] = newCard;
        // } else if (cardToRemove) {
        //   game.activeCards[level] = cardArray.filter(
        //     (card) => cardToRemove !== card
        //   );
        // }
      }
      break;
    case "inactiveCard":
      if (game.inactiveCards[cardID].length > 0) {
        // cardID is the level
        game.inactiveCards[cardID].shift(); // Remove first inactiveCard
      }
      break;
    case "nobleCard":
      // for (const card of game.nobles) {
      //   if (card._id.toString() === cardID) {
      //     return card;
      //   }
      // }
      break;

    default:
      throw `${cardGroup} invalid card group (splendor)`;
  }
};
