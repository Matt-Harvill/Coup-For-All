import { createContext } from "react";

// set the defaults
const AppContext = createContext({
  auth: "default",
  setAuth: () => {},
  page: "default",
  setPage: () => {},
});

export default AppContext;
