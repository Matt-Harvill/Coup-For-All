import { endTurn, setTurn, startNewStage } from "./turns.js";

export const checkCanGetNobles = (game) => {
  // For now just don't let the player get nobles
  let numberOfNoblesAvailable = 0;

  if (numberOfNoblesAvailable > 0) {
    setTurn(game, { stage: "selectNoble" });
    startNewStage(game);
  } else {
    endTurn(game);
  }
};
