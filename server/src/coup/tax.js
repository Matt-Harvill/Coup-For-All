import { endStage, endTurn, getTurnProp, setTurn } from "./inProgressTurns.js";
import { getGame, updateUserAndGame, getUserObj } from "../utils/dbUtils.js";

export const postCalloutTax = async (game) => {
  const player = getTurnProp(game.gameID, "player");
  const user = await getUserObj(player);

  const pStat = game.pStats.find((pStat) => {
    if (pStat.player === user.username) {
      pStat.coins += 3;
      return pStat;
    }
  });

  if (!pStat) {
    console.log("Error updating tax for", user.username);
  }

  const committed = await updateUserAndGame(user, game, "updateGame");

  if (!committed) {
    console.log("Error committing tax for", user.username);
  }

  // End the turn
  endTurn(game);
};

export const preCalloutTax = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const otherPlayers = game.players.filter(
      (player) => player !== user.username
    );

    // Update the action to tax, add player as a target, update deciding to be other players
    setTurn(game, {
      action: "tax",
      target: { target: user.username, action: "tax", attacking: "none" },
      deciding: otherPlayers,
    });

    // End the preCallout stage for tax
    endStage(game);
  }
};
