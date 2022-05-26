import { createContext } from "react";

// set the defaults
const SplendorGameContext = createContext({
  game: {},
  setGame: () => {},
  turn: {},
  setTurn: () => {},
});

export default SplendorGameContext;
