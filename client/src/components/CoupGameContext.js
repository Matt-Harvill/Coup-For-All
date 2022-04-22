import { createContext } from "react";

// set the defaults
const CoupGameContext = createContext({
  games: "",
  setGames: () => {},
  inGame: false,
  setInGame: () => {},
  ownsGame: false,
  setOwnsGame: () => {},
  privacy: "",
  setPrivacy: () => {},
  numPlayers: "",
  setNumPlayers: () => {},
});

export default CoupGameContext;
