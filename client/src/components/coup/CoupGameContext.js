import { createContext } from "react";

// set the defaults
const CoupGameContext = createContext({
  game: {},
  setGame: () => {},
  turn: {},
  setTurn: () => {},
});

export default CoupGameContext;
