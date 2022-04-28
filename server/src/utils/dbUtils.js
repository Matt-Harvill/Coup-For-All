import { User } from "../schemas.js";
import { conn } from "../index.js";
import { sendUpdatesSingle } from "./socketUtils.js";
import gameSchemaSwitch from "../gameSchemaSwitch.js";
import { assignRoles } from "../coup/assignRoles.js";

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

  try {
    switch (update) {
      case "deleteGame":
        await gameSchemaSwitch(game.gameTitle).deleteOne(
          { gameID: game.gameID },
          { session }
        );
        // Update all the users after deleting the game
        for (let i = 0; i < game.players.length; i++) {
          const user = game.players[i];
          await updateUser(user, "", "", "", {}, session);
          usersUpdated.push(user);
        }
        break;
      case "lastPlayerLeft":
        await gameSchemaSwitch(game.gameTitle).deleteOne(
          { gameID: game.gameID },
          { session }
        );
        await updateUser(user, "", "", "", {}, session);
        usersUpdated.push(user);
        break;
      case "assignRoles":
      case "createGame":
      case "joinGame":
        // Uses session by default
        game.markModified("pStats.roles");
        let savedGame = await game.save().then((savedGame) => {
          console.log(savedGame.pStats);
          console.log("savedGame = game", savedGame === game); // true
        });
        console.log("game in DB:", savedGame);
        // Update all the users after someone joins the game, or created (just that user anyways)
        for (let i = 0; i < game.players.length; i++) {
          const user = game.players[i];
          await updateUser(
            user,
            game.gameTitle,
            game.gameID,
            game.status,
            game.pStats.get(user),
            session
          );
          usersUpdated.push(user);
        }
        break;
      case "leaveGame":
        // Uses session by default
        await game.save().then((savedGame) => {
          console.log(savedGame.pStats);
          console.log("savedGame = game", savedGame === game); // true
        });
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

    if (usersUpdated.length > 0) {
      for (let i = 0; i < usersUpdated.length; i++) {
        let gameToUpdate;
        // Only send a game update if assignRoles was the update (for now)
        if (update === "assignRoles") {
          gameToUpdate = await getGame(game.gameTitle, game.gameID);
        }
        sendUpdatesSingle(usersUpdated[i], gameToUpdate);
      }
    } else {
      throw "error numUsersUpdated users";
    }
  } else {
    await session.abortTransaction();
    session.endSession();
  }

  return transactSuccess;
};
