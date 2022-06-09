import { User } from "../schemas.js";
import { conn } from "../index.js";
import { sendUpdatesSingle } from "./socketUtils.js";
import gameSchemaSwitch from "../gameSchemaSwitch.js";
import {
  createTurn,
  deleteTurn,
  endTurn,
  getTurnProp,
} from "../coup/inProgressTurns.js";
import { gameOver } from "../coup/gameOver.js";
import gameSwitch from "../gameSwitch.js";
import dbTurnUpdateHandlerSwitch from "./dbTurnUpdateHandlerSwitch.js";

export const getUserObj = async (username) => {
  return await User.findOne({
    username: username,
  }).exec();
};

export const getGame = async (gameTitle, gameID) => {
  return await gameSchemaSwitch(gameTitle).findOne({ gameID: gameID });
};

const updateUser = async (
  username,
  gameTitle,
  gameID,
  gameStatus,
  pStat,
  session
) => {
  await User.updateOne(
    { username: username },
    {
      gameID: gameID,
      gameTitle: gameTitle,
      gameStatus: gameStatus,
      pStat: pStat,
    },
    { session }
  );
};

export const updateUserAndGame = async (user, game, update) => {
  const session = await conn.startSession();
  session.startTransaction();

  let transactSuccess = true;
  let usersUpdated = [];

  // Update all players (both still in or out of the game)
  const allPlayers = game.players.concat(game.outPlayers);

  try {
    switch (update) {
      case "deleteGame": // Called only when last player or game still forming
        await gameSchemaSwitch(game.gameTitle).deleteOne(
          { gameID: game.gameID },
          { session }
        );
        // Update all the users after deleting the game
        for (const player of allPlayers) {
          await updateUser(player, "", "", "", {}, session);
          usersUpdated.push(player);
        }
        break;
      case "updateGame":
        await game.save(); // Uses session by default
        // Update all the users after someone joins the game, or created (just that user anyways)
        for (const player of allPlayers) {
          const [pStat] = game.pStats.filter((pStat) => {
            return pStat.player === player;
          });
          await updateUser(
            player,
            game.gameTitle,
            game.gameID,
            game.status,
            pStat,
            session
          );
          usersUpdated.push(player);
        }
        break;
      case "leaveGame": // Only called if game still has players
        await game.save(); // Uses session by default
        await updateUser(user, "", "", "", {}, session);
        usersUpdated.push(user);
        break;
      default:
        throw "No update style specified in updateUserAndGame";
    }
  } catch (err) {
    console.log(err);
    transactSuccess = false;
  }

  if (transactSuccess) {
    await session.commitTransaction();
    session.endSession();

    let updatedGame;
    // Only send a game update if game is in progress, in which case, update all players
    if (game.status === "in progress") {
      updatedGame = await getGame(game.gameTitle, game.gameID);
      if (update === "leaveGame") {
        usersUpdated.push(...allPlayers);
      }
    }
    // Update all the players in the game
    for (const user of usersUpdated) {
      sendUpdatesSingle(user, updatedGame);
    }

    // Handle turns
    if (game && game.gameTitle) {
      await dbTurnUpdateHandlerSwitch(
        game,
        game.gameTitle,
        updatedGame,
        update,
        user
      );
    }

    // Otherwise no game/gameTitle
    if (!game || !game.gameTitle) {
      console.log(`Not game or gameTitle`);
    }
  } else {
    await session.abortTransaction();
    session.endSession();
  }

  return transactSuccess;
};
