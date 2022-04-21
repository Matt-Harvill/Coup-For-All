import { createContext } from "react";

// set the defaults
const CoupCreateGameContext = createContext({
  games: "",
  setGames: () => {},
  privacy: "",
  setPrivacy: () => {},
  numPlayers: "",
  setNumPlayers: () => {},
});

export default CoupCreateGameContext;
