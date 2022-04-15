export const allowedPage = (auth, currPage, desiredPage) => {
  if (auth === "auth") {
    if (desiredPage !== "login" && desiredPage !== "register") {
      return desiredPage;
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
