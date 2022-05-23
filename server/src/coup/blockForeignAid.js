import { getGame } from "../utils/dbUtils.js";
import { setTurn, startNewStage } from "./inProgressTurns.js";

export const blockForeignAid = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const otherPlayers = game.players.filter(
      (player) => player !== user.username
    );

    // Update turn -> add player as a target, update deciding to be other players
    setTurn(game, {
      targets: [
        { target: user.username, action: "foreignAid", attacking: "none" },
      ],
      deciding: otherPlayers,
    });

    // Restart callout stage
    startNewStage(game);
  }
};

export const blockSteal = async (user, role) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const otherPlayers = game.players.filter(
      (player) => player !== user.username
    );

    // Update turn -> add player as a target, update deciding to be other players
    setTurn(game, {
      targets: [
        {
          target: user.username,
          action: "blockSteal",
          attacking: "none",
          blockingRole: role,
        },
      ],
      deciding: otherPlayers,
    });

    // Restart callout stage
    startNewStage(game);
  }
};
