import { createContext } from "react";

// set the defaults
const CoupGameContext = createContext({
  game: {},
  setGame: () => {},
  turnInfo: {},
});

export default CoupGameContext;
