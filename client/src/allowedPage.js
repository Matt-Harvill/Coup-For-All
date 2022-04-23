export const allowedPage = (userObj, auth, currPage, desiredPage) => {
  if (auth === "auth") {
    if (desiredPage !== "login" && desiredPage !== "register") {
      // If user is in a game, send them to that page
      if (userObj.gameStatus === "in progress") {
        let wantedDiffPage = false;
        let newPage;
        switch (userObj.gameTitle) {
          case "coup":
            if (desiredPage !== "coupGame") {
              wantedDiffPage = true;
            }
            newPage = "coupGame";
            break;
          default:
            break;
        }
        if (wantedDiffPage) {
          alert("You must leave your current game before switching pages");
        }
        return newPage;
      } else {
        return desiredPage; // Otherwise return desirePage
      }
    } else {
      alert("You are already logged in");
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
