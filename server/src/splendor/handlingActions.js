import { getGame, updateUserAndGame } from "../utils/dbUtils.js";
import { buyCard } from "./buyCard.js";
import { takeCoins } from "./takeCoins.js";
import { endStage, getTurnProp, setTurn } from "./turns.js";

export const selectAction = async (user, action) => {
  const game = await getGame(user.gameTitle, user.gameID);
  setTurn(game, { action: action });
};

export const cancelAction = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);
  setTurn(game, {
    action: null,
    selectedCardID: null,
    selectedCardGroup: null,
    selectedCoins: {
      green: 0,
      blue: 0,
      green: 0,
      blue: 0,
      green: 0,
      yellow: 0,
    },
  });
};

export const submitAction = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const action = getTurnProp(game.gameID, "action");
    let success;
    switch (action) {
      case "takeCoins":
        success = await takeCoins(user);
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

export const selectCoin = async (user, coin) => {
  const turnCoins = getTurnProp(user.gameID, "coins");
  const selectedCoins = getTurnProp(user.gameID, "selectedCoins");

  if (turnCoins && selectedCoins) {
    const game = await getGame(user.gameTitle, user.gameID);
    const numCoinPrev = turnCoins[coin];
    const numSelectedPrev = selectedCoins[coin];
    if (game) {
      setTurn(game, {
        coins: { ...turnCoins, [coin]: numCoinPrev - 1 },
        selectedCoins: { ...selectedCoins, [coin]: numSelectedPrev + 1 },
      });
    }
  }
};

export const unselectCoin = async (user, coin) => {
  const turnCoins = getTurnProp(user.gameID, "coins");
  const selectedCoins = getTurnProp(user.gameID, "selectedCoins");

  if (turnCoins && selectedCoins) {
    const game = await getGame(user.gameTitle, user.gameID);
    const numCoinPrev = turnCoins[coin];
    const numSelectedPrev = selectedCoins[coin];
    if (game) {
      setTurn(game, {
        coins: { ...turnCoins, [coin]: numCoinPrev + 1 },
        selectedCoins: { ...selectedCoins, [coin]: numSelectedPrev - 1 },
      });
    }
  }
};
