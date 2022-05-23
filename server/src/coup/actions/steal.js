import { getGame, updateUserAndGame } from "../../utils/dbUtils.js";
import { endStage, endTurn, getTurnProp, setTurn } from "../inProgressTurns.js";

export const stealEndStage = (game, stage) => {};

export const postCalloutSteal = async (game) => {
  const player = getTurnProp(game.gameID, "player");
  const target = getTurnProp(game.gameID, "attacking");

  const pStat = game.pStats.find((pStat) => pStat.player === player);
  const targetStat = game.pStats.find((pStat) => pStat.player === target);

  if (!pStat || !targetStat) {
    console.log(`Error updating steal for ${player} with target ${target}`);
  }

  if (targetStat.coins === 1) {
    targetStat.coins -= 1;
    pStat.coins += 1;
  } else if (targetStat.coins > 1) {
    targetStat.coins -= 2;
    pStat.coins += 2;
  } else {
    // Do nothing if no coins to steal from
    endTurn(game);
    return;
  }

  const committed = await updateUserAndGame(player, game, "updateGame");

  if (!committed) {
    console.log(`Error committing steal for ${player} with target ${target}`);
  }

  // End the turn
  endTurn(game);
};

export const preCalloutSteal = async (user, target) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const otherPlayers = game.players.filter(
      (player) => player !== user.username
    );

    // Update the action to steal, add player as a target (with attacking as the target), update deciding to be other players
    setTurn(game, {
      action: "steal",
      attacking: target,
      target: { target: user.username, action: "steal", attacking: target },
      deciding: otherPlayers,
    });

    // End the preCallout stage for steal
    endStage(game);
  }
};
