import { createContext } from "react";

// set the defaults
const CoupLobbyGamesContext = createContext({
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

export default CoupLobbyGamesContext;
