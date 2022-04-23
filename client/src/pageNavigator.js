export const allowedPage = (appState, desiredPage) => {
  const userObj = appState.userObj;
  const auth = appState.auth;
  const currPage = appState.page;

  if (auth === "auth") {
    if (desiredPage !== "login" && desiredPage !== "register") {
      // If user is in a game, send them to that page
      // if (userObj.gameStatus === "in progress") {
      //   switch (userObj.gameTitle) {
      //     case "coup":
      //       return "coupGame";
      //     default:
      //       break;
      //   }
      // }
      return desiredPage; // Otherwise return desirePage
    } else {
      return currPage;
    }
  } else {
    if (desiredPage === "register") {
      return desiredPage;
    } else {
      return "login";
    }
  }
};
