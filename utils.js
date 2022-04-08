import { User } from "./schemas.js";
import { conn } from "./index.js";
import { games } from "./coup.js";

export const updateUser = (username, gameTitle, gameID, pStat) => {
  User.updateOne(
    { username: username },
    { gameID: gameID, gameTitle: gameTitle, pStat: pStat },
    (err) => {
      if (err) {
        console.log(err);
        throw new Error(err);
      }
    }
  );
};

export const updateUserAndGame = async (user, game) => {
  const session = await conn.startSession();
  session.startTransaction();

  let transactError = false;

  try {
    await game.save();
    updateUser(user, game.gameTitle, game.gameID, game.pStats.get(user));
  } catch (err) {
    console.log(err);
    transactError = true;
  }

  if (transactError) {
    session.abortTransaction();
  } else {
    session.commitTransaction();
    games.add(game);
  }

  session.endSession();
};
