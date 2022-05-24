import {
  endStage,
  endTurn,
  getTurnProp,
  setTurn,
  startNewStage,
} from "../inProgressTurns.js";
import { getGame, updateUserAndGame } from "../../utils/dbUtils.js";

// Assassinate -> selectAction, challengeRole (loseSwapRoles), blockAction (challengeRole (loseSwapRoles)), completeAction (loseSwapRoles)

export const assassinateEndStage = async (game, stage) => {
  const target = getTurnProp(game.gameID, "target");
  // console.log(`Assassin end stage ${stage} called`);

  switch (stage) {
    case "selectAction":
      setTurn(game, { stage: "challengeRole" });
      break;
    case "challengeRole":
      const loseSwap = getTurnProp(game.gameID, "loseSwap");
      if (loseSwap.losing || loseSwap.swapping) {
        setTurn(game, { stage: "loseSwapRoles" });
      } else {
        // Assassinate has been selected and not contested
        if (target.action === "assassinate") {
          await prepareAssassinate(game);
        }
        // Assassinate has been prepared and then blocked
        else if (target.action === "blockAssassinate") {
          endTurn(game);
          return;
        } else {
          throw `${target.action} not valid target action in assassinate`;
        }
      }
      break;
    case "blockAction":
      // Assassinate block not attempted, so go through with it
      if (target.action === "assassinate") {
        setTurn(game, { stage: "completeAction" });
      }
      // Assassinate block attempted, check if block defends
      else if (target.action === "blockAssassinate") {
        setTurn(game, { stage: "challengeRole" });
      } else {
        throw `${target.action} not valid target action in assassinate`;
      }
      break;
    case "loseSwapRoles":
      const actionSuccess = getTurnProp(game.gameID, "actionSuccess");
      if (actionSuccess) {
        const assassinating = getTurnProp(game.gameID, "assassinating");
        // If assassinating, this was final stage
        if (assassinating) {
          endTurn(game);
          return;
        }
        // Assassinate has been selected and not contested
        else if (target.action === "assassinate") {
          await prepareAssassinate(game);
        } else if (target.action === "blockAssassinate") {
          setTurn(game, { stage: "completeAction" }); // If not assassinating, go to complete it
        } else {
          throw `${target.action} not valid target action in assassinate`;
        }
      } else {
        endTurn(game);
        return;
      }
      break;
    case "completeAction":
      // After assassination complete, carry out losing roles
      setTurn(game, { stage: "loseSwapRoles" });
      break;
    default:
      throw `${stage} not valid endStage for assassinate`;
  }

  startNewStage(game);
  const newStage = getTurnProp(game.gameID, "stage");
  if (newStage === "completeAction") {
    completeAssassinate(game);
  }
};

const prepareAssassinate = async (game) => {
  const player = getTurnProp(game.gameID, "player");
  const pStat = game.pStats.find((pStat) => {
    if (pStat.player === player) {
      pStat.coins -= 3;
      return pStat;
    }
  });

  if (!pStat) {
    console.log(`Error preparing assassinate for ${player}`);
  } else {
    // If player doesn't have enough coins, don't allow the assassination
    if (pStat.coins < 0) {
      return;
    }

    const committed = await updateUserAndGame(player, game, "updateGame");
    if (!committed) {
      console.log(`Error committing assassinate prep for ${player}`);
    } else {
      setTurn(game, { stage: "blockAction" });
    }
  }
};

export const completeAssassinate = (game) => {
  const target = getTurnProp(game.gameID, "attacking");

  setTurn(game, {
    loseSwap: {
      losing: {
        player: target,
      },
    },
    assassinating: true,
  });

  endStage(game);
};

export const selectAssassinate = async (user, target) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (game) {
    const otherPlayers = game.players.filter(
      (player) => player !== user.username
    );

    setTurn(game, {
      action: "assassinate",
      attacking: target,
      target: {
        target: user.username,
        action: "assassinate",
      },
      challenging: otherPlayers,
    });

    endStage(game);
  }
};
