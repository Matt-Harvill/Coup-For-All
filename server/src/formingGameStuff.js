import { coupFormingGames } from "./coup/coupEventHandler.js";
import { io } from "./index.js";
import { splendorFormingGames } from "./splendor/splendorEventHandler.js";
import { getGame, updateUserAndGame } from "./utils/dbUtils.js";

const formingGamesSwitch = (gameTitle) => {
  switch (gameTitle) {
    case "coup":
      return coupFormingGames;
    case "splendor":
      return splendorFormingGames;
    default:
      break;
  }
};

export const deleteFormingGame = async (user) => {
  const gameTitle = user.gameTitle;
  if (gameTitle && gameTitle != "") {
    const game = await getGame(user.gameTitle, user.gameID);
    if (game && game.status === "forming") {
      const committed = await updateUserAndGame(
        user.username,
        game,
        "deleteGame"
      );
      if (committed) {
        // console.log("forming game deleted");
        const formingGames = formingGamesSwitch(gameTitle);
        // Delete game from memory
        formingGames.forEach((gameInSet) => {
          if (gameInSet.gameID === game.gameID) {
            formingGames.delete(gameInSet);
          }
        });
        // Update users with deletion of forming game
        io.emit(gameTitle, "formingGames", Array.from(formingGames));
      }
    }
  }
};
