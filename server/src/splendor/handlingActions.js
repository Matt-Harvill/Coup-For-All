import { getGame } from "../utils/dbUtils.js";
import { buyCard } from "./buyCard.js";
import { endStage, getTurnProp, setTurn } from "./turns.js";

export const selectAction = async (user, action) => {
  const game = await getGame(user.gameTitle, user.gameID);
  setTurn(game, { action: action });
};

export const cancelAction = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);
  setTurn(game, { action: null });
};

export const submitAction = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const action = getTurnProp(game.gameID, "action");
    let success;
    switch (action) {
      case "takeCoins":
        // takeCoins();
        break;
      case "reserveCard":
        // takeCoins();
        break;
      case "buyCard":
        success = await buyCard(user, game);
        break;
      case "selectNoble":
        // takeCoins();
        break;
      default:
        break;
    }

    if (success) {
      endStage(game);
    }
  }
};
