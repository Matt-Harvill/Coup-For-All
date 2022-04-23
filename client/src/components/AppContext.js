import { createContext } from "react";

// set the defaults
const AppContext = createContext({
  auth: "",
  setAuth: () => {},
  page: "",
  setNewPage: () => {},
  userObj: {
    username: "",
    gameTitle: "",
    gameID: "",
    gameStatus: "",
    pStat: {},
  },
  setUserObj: () => {},
});

export default AppContext;
