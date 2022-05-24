import { getGame } from "../utils/dbUtils.js";
import { endStage, getTurnProp, setTurn } from "./inProgressTurns.js";
import AsyncLock from "async-lock";

const lock = new AsyncLock();
const key = "challengeKey";

const lockedBlockForeignAid = async (user) => {
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

export const blockForeignAid = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);
  if (game) {
    const gameID = game.gameID;
    const stageID = getTurnProp(gameID, "stageID");

    lock.acquire(key, () => {
      const blocked = getTurnProp(gameID, "blocked");
      if (
        getTurnProp(gameID, "stage") === "blockAction" &&
        getTurnProp(gameID, "stageID") === stageID &&
        !blocked
      ) {
        setTurn(game, { blocked: true });
        lockedBlockForeignAid(user);
      }
    });
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
