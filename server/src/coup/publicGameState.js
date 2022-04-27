export const publicGameState = (game, username) => {
  const pStats = game.pStats;

  for (const [player, pStat] of Object.entries(pStats)) {
    if (player !== username) {
      pStat.roles = ["default", "default"];
    }
  }

  return game;
};
