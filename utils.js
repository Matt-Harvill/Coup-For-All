import { User } from "./schemas.js";

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
