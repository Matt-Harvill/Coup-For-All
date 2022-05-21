import { endStage, endTurn, getTurnProp, setTurn } from "./inProgressTurns.js";
import { getGame, updateUserAndGame, getUserObj } from "../utils/dbUtils.js";

export const postCalloutExchange = async (game) => {
  //---- for now just do nothing ----//

  // // Do postCallout stuff
  // setTurn(game, { stage: "postCallout" });
  // startNewStage(game);

  // const player = getTurnProp(game.gameID, "player");
  // const user = await getUserObj(player);

  // const pStat = game.pStats.find((pStat) => {
  //   if (pStat.player === user.username) {
  //     pStat.coins += 2;
  //     return pStat;
  //   }
  // });

  // if (!pStat) {
  //   console.log("Error updating exchange for", user.username);
  // }

  // const committed = await updateUserAndGame(user, game, "updateGame");

  // if (!committed) {
  //   console.log("Error committing exchange for", user.username);
  // }

  // End the turn
  endTurn(game);
};

export const preCalloutExchange = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const otherPlayers = game.players.filter(
      (player) => player !== user.username
    );

    // Update the action to exchange, add player as a target, update deciding to be other players
    setTurn(game, {
      action: "exchange",
      targets: [
        { target: user.username, action: "exchange", attacking: "none" },
      ],
      deciding: otherPlayers,
    });

    // End the preCallout stage for exchange
    endStage(game);
  }
};
