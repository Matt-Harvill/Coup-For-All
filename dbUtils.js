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

export const updateUserAndGame = async (user, game, deleteGame = false) => {
  const session = await conn.startSession();
  session.startTransaction();

  let transactError = false;

  try {
    // If game is being deleted
    if (deleteGame) {
      gameCollection.deleteOne({ gameID: game.gameID });
      // Update all the users after deleting the game
      for (let i = 0; i < game.players.length; i++) {
        const user = game.players[i];
        await updateUser(user, "", "", "", {}, session);
      }
    }
    // If game is being updated
    else {
      await game.save({ session });
      await updateUser(
        user,
        game.gameTitle,
        game.gameID,
        game.status,
        game.pStats.get(user),
        session
      );
    }
  } catch (err) {
    console.log(err);
    transactError = true;
  }

  let commitStatus;
  if (transactError) {
    await session.abortTransaction();
    commitStatus = false;
  } else {
    await session.commitTransaction();
    commitStatus = true;
  }

  session.endSession();
  return commitStatus;
};
