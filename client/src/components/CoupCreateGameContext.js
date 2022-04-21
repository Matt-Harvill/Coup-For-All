import { createContext } from "react";

// set the defaults
const CoupCreateGameContext = createContext({
  privacy: "",
  setPrivacy: () => {},
  numPlayers: "",
  setNumPlayers: () => {},
});

export default CoupCreateGameContext;
