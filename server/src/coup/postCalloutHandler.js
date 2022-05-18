import { endTurn } from "./endTurn.js";
import { getGame, getUserObj, updateUserAndGame } from "../utils/dbUtils.js";

const handleForeignAid = async (player) => {
  const user = await getUserObj(player);
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const pStat = game.pStats.find((pStat) => {
      if (pStat.player === user.username) {
        pStat.coins += 2;
        return pStat;
      }
    });

    if (!pStat) {
      console.log("Error updating foreignAid for", user.username);
    }

    const committed = await updateUserAndGame(user, game, "updateGame");
    console.log(game.players, "after updating coins for foreignAid");

    if (!committed) {
      console.log("Error committing foreignAid for", user.username);
    } else {
      await endTurn(null, game);
    }
  }
};

export const postCalloutHandler = async (player, action) => {
  switch (action) {
    case "foreignAid":
      await handleForeignAid(player);
      break;

    default:
      break;
  }
};
