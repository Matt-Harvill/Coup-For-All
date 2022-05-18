import { getGame } from "../utils/dbUtils.js";
import { endStage, setTurn } from "./inProgressTurns.js";

export const newForeignAid = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const otherPlayers = game.players.filter(
      (player) => player !== user.username
    );

    // Update the action to foreignAid, add player as a target, update deciding to be other players
    setTurn(game, {
      action: "foreignAid",
      targets: [{ target: user.username, action: "foreignAid" }],
      deciding: otherPlayers,
    });

    // End the preCallout stage for foreignAid
    endStage(game);
  }
};
