import { User } from "./schemas.js";
import { conn } from "./index.js";
import { games } from "./coup.js";

export const updateUser = async (
  session,
  username,
  gameTitle,
  gameID,
  pStat
) => {
  await User.updateOne(
    { username: username },
    { gameID: gameID, gameTitle: gameTitle, pStat: pStat },
    { session }
  );
};

export const updateUserAndGame = async (user, game) => {
  const session = await conn.startSession();
  session.startTransaction();

  let transactError = false;

  try {
    await game.save({ session });
    await updateUser(
      session,
      user,
      game.gameTitle,
      game.gameID,
      game.pStats.get(user)
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
