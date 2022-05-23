import {
  endStage,
  endTurn,
  getTurnProp,
  setTurn,
  startNewStage,
} from "../inProgressTurns.js";
import { getGame, updateUserAndGame } from "../../utils/dbUtils.js";
import { shuffleArray } from "../../utils/shuffleArray.js";

export const exchangeEndStage = (game, stage) => {
  switch (stage) {
    case "selectAction":
      setTurn(game, { stage: "challengeRole" });
      break;
    case "challengeRole":
      const loseSwap = getTurnProp(game.gameID, "loseSwap");
      if (loseSwap.losing || loseSwap.swapping) {
        setTurn(game, { stage: "loseSwapRoles" });
      } else {
        setTurn(game, { stage: "completeAction" });
      }
      break;
    case "loseSwapRoles":
      const actionSuccess = getTurnProp(game.gameID, "actionSuccess");
      if (actionSuccess) {
        setTurn(game, { stage: "completeAction" });
      } else {
        endTurn(game);
      }
      break;
    case "completeAction":
      endTurn(game);
      return;
    default:
      throw `${stage} not valid endStage for exchange`;
  }

  startNewStage(game);
};

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

export const completeExchange = async (user, selectedRoles) => {
  const game = await getGame(user.gameTitle, user.gameID);
  const pStat = game.pStats.find((pStat) => pStat.player === user.username);

  if (!pStat) {
    console.log(`Error completing exchange for ${user.username}`);
  } else {
    let newRoles = [];
    let oldRoles = [];
    for (const role of selectedRoles) {
      if (role.isNew) {
        newRoles.push(role.role);
      } else {
        oldRoles.push(role.role);
      }
    }

    if (newRoles.length > 0) {
      let availRoles = shuffleArray(game.availRoles);

      // Add back the role(s) that is/are being exchanged into availRoles
      for (const role of pStat.roles) {
        if (!oldRoles.includes(role)) {
          availRoles.push(role);
        } else {
          removeItemOnce(oldRoles, role);
        }
      }
      // Remove new roles from availRoles
      for (const role of newRoles) {
        removeItemOnce(availRoles, role);
      }
      // Update pStat
      pStat.roles = [];
      for (const role of selectedRoles) {
        pStat.roles.push(role.role);
      }

      setTurn(game, { exchangeRoles: null }); // so exchangeButton hides before game update

      const committed = await updateUserAndGame(user, game, "updateGame");

      if (!committed) {
        console.log(`Error committing exchange for ${user.username}`);
      } else {
        endStage(game);
      }
    } else {
      endStage(game);
    }
  }
};

export const prepareExchange = (game) => {
  shuffleArray(game.availRoles);
  const exchangeRoles = game.availRoles.slice(0, 2); // First two roles
  setTurn(game, { exchangeRoles: exchangeRoles });
};

export const selectExchange = async (user) => {
  const game = await getGame(user.gameTitle, user.gameID);

  if (!game) {
    console.log(`Error selecting exchange for ${user.username}`);
  } else {
    const otherPlayers = game.players.filter(
      (player) => player !== user.username
    );

    setTurn(game, {
      action: "exchange",
      target: { target: user.username, action: "exchange" },
      challenging: otherPlayers,
    });

    endStage(game);
  }
};
