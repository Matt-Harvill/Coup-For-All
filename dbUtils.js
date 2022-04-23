import { User } from "./schemas.js";
import { conn, gameCollection } from "./index.js";

export const getUserObj = async (username) => {
  return await User.findOne({
    username: username,
  }).exec();
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

  try {
    switch (update) {
      case "deleteGame":
        gameCollection.deleteOne({ gameID: game.gameID });
        // Update all the users after deleting the game
        for (let i = 0; i < game.players.length; i++) {
          const user = game.players[i];
          await updateUser(user, "", "", "", {}, session);
        }
        break;
      case "createGame":
      case "joinGame":
        await game.save({ session });
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
        }
        break;
      case "leaveGame":
        await game.save({ session });
        await updateUser(user, "", "", "", {}, session);
        break;
      default:
        throw "No update style specified in updateUserAndGame";
        break;
    }
  } catch (err) {
    console.log(err);
    transactSuccess = false;
  }

  if (transactSuccess) {
    await session.commitTransaction();
  } else {
    await session.abortTransaction();
  }

  session.endSession();
  return transactSuccess;
};
