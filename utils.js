import { CoupGame, User } from "./schemas.js";
import { conn } from "./index.js";
import { games } from "./coup.js";

export const deleteCoupGame = (gameID) => {
  CoupGame.deleteOne({ gameID: gameID }, (err) => {
    if (err) {
      throw err;
    }
  });
};

export const getCoupGame = async (gameID) => {
  return await CoupGame.findOne({ gameID: gameID }).exec();
};

export const getUserObj = async (username) => {
  return await User.findOne({
    username: username,
  }).exec();
};

export const updateUser = async (
  username,
  gameTitle,
  gameID,
  gameStatus,
  pStat,
  session = undefined // Undefined session by default
) => {
  if (session === undefined) {
    await User.updateOne(
      { username: username },
      {
        gameID: gameID,
        gameTitle: gameTitle,
        gameStatus: gameStatus,
        pStat: pStat,
      }
    );
  } else {
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
  }
};

export const updateUserAndGame = async (user, game) => {
  const session = await conn.startSession();
  session.startTransaction();

  let transactError = false;

  try {
    await game.save({ session });
    await updateUser(
      user,
      game.gameTitle,
      game.gameID,
      game.status,
      game.pStats.get(user),
      session
    );
  } catch (err) {
    console.log(err);
    transactError = true;
  }

  if (transactError) {
    await session.abortTransaction();
  } else {
    await session.commitTransaction();
    games.add(game);
  }

  session.endSession();
};
