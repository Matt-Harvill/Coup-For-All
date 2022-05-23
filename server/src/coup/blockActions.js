import { getGame } from "../utils/dbUtils.js";
import { endStage, setTurn } from "./inProgressTurns.js";

export const blockForeignAid = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const otherPlayers = game.players.filter(
      (player) => player !== user.username
    );

    setTurn(game, {
      target: {
        target: user.username,
        action: "blockForeignAid",
      },
      challenging: otherPlayers,
    });

    endStage(game);
  }
};

export const blockSteal = async (user, role) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const otherPlayers = game.players.filter(
      (player) => player !== user.username
    );

    setTurn(game, {
      target: {
        target: user.username,
        action: "blockSteal",
        blockingRole: role,
      },
      challenging: otherPlayers,
    });

    endStage(game);
  }
};

export const blockAssassinate = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const otherPlayers = game.players.filter(
      (player) => player !== user.username
    );

    setTurn(game, {
      target: {
        target: user.username,
        action: "blockAssassinate",
      },
      challenging: otherPlayers,
    });

    endStage(game);
  }
};
