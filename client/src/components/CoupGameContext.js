import { createContext } from "react";

// set the defaults
const CoupGameContext = createContext({
  games: "",
  setGames: () => {},
  hasGame: false,
  setHasGame: () => {},
  privacy: "",
  setPrivacy: () => {},
  numPlayers: "",
  setNumPlayers: () => {},
});

export default CoupGameContext;
