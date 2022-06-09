import { endStage, getTurnProp } from "./turns.js";

export const selectActionTimeout = async (game) => {
  const player = getTurnProp(game.gameID, "player");

  const pStat = game.pStats.find((pStat) => {
    return pStat.player === player;
  });

  if (!pStat) {
    console.log(
      `Error in splendor selectActionTimeout for ${player} with gameID ${game.gameID}`
    );
  } else {
    // Currently don't do anything automatically for player if they don't perform an action
  }

  endStage(game);
};

export const selectNobleTimeout = async (game) => {
  const player = getTurnProp(game.gameID, "player");

  const pStat = game.pStats.find((pStat) => {
    return pStat.player === player;
  });

  if (!pStat) {
    console.log(
      `Error in splendor selectNobleTimeout for ${player} with gameID ${game.gameID}`
    );
  } else {
    // Currently don't do anything automatically for player if they don't select a noble
  }

  endStage(game);
};
