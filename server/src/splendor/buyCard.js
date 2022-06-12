import { updateUserAndGame } from "../utils/dbUtils.js";
import { filterCardFromID, getCardFromID } from "./cardIDUtils.js";
import { getTurnProp } from "./turns.js";

export const buyCard = async (userObj, game) => {
  const cardToBuyID = getTurnProp(game.gameID, "selectedCardID");
  const cardToBuyGroup = getTurnProp(game.gameID, "selectedCardGroup");
  const cardToBuy = getCardFromID(cardToBuyID, cardToBuyGroup, game);

  // Carry out the functionality to buy a card

  const username = userObj.username;
  const pStats = game.pStats;

  const pStat = pStats.find((pStat) => pStat.player === username);

  const requirements = cardToBuy.requirements;
  // Remove permanentResources from requirements
  for (const [resource, count] of Object.entries(pStat.permanentResources)) {
    requirements[resource] -= count;
  }
  // Remove coins from requirements, update pStat.coins
  for (let [resource, coinCount] of Object.entries(pStat.coins)) {
    if (resource !== "yellow") {
      if (requirements[resource] > coinCount) {
        requirements[resource] -= coinCount;
        coinCount -= coinCount;
      } else if (requirements[resource] > 0) {
        coinCount -= requirements[resource];
        requirements[resource] -= requirements[resource];
      }
    } else {
      for (let [res, cnt] of Object.entries(requirements)) {
        if (cnt > 0) {
          if (coinCount >= cnt) {
            coinCount -= cnt;
            cnt -= cnt;
          } else {
            cnt -= coinCount;
            coinCount -= coinCount;
          }
        }
      }
    }
  }
  // Check if any requirements are > 0
  // for (const [resource, count] of Object.entries(requirements)) {
  //   if (count > 0) {
  //     // Return from function if not enough resources to buy the card
  //     return;
  //   }
  // }

  // Add points to pStat
  pStat.points += cardToBuy.points;

  filterCardFromID(cardToBuyID, cardToBuyGroup, game);
  // Check if player can get noble(s)
  // possibleNobles = [];
  // const nobles = game.nobles;
  // for(let i = 0; i < nobles.length; i++){
  //   var curNoble = nobles[i];
  //   if(curNoble.cardRequirements.red > curPStats.permanentResources.red){
  //     continue;
  //   }
  //   if(curNoble.cardRequirements.green > curPStats.permanentResources.green){
  //     continue;
  //   }
  //   if(curNoble.cardRequirements.blue > curPStats.permanentResources.blue){
  //     continue;
  //   }
  //   if(curNoble.cardRequirements.black > curPStats.permanentResources.black){
  //     continue;
  //   }
  //   if(curNoble.cardRequirements.white > curPStats.permanentResources.white){
  //     continue;
  //   }
  //   possibleNobles.push(curNoble);
  //   nobles.splice(i, 1);
  // }
  // // can only get one noble, so we grab it
  // if(possibleNobles.length == 1){
  //   curPStats.points += possibleNobles[0].points;
  // }
  // // they can choose multiple
  // else{
  //   // we let them choose one, i dont rly know how that works tho

  //   // add the one we didn't choose back to the nobles array
  // }

  const committed = await updateUserAndGame(username, game, "updateGame");

  if (!committed) {
    console.log(`Error buying card for ${userObj} in buyCard`);
  }

  return committed;
};
