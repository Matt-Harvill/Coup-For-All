import { createContext } from "react";

// set the defaults
const AppContext = createContext({
  auth: "",
  setAuth: () => {},
  page: "",
  setPage: () => {},
  user: "",
  setUser: () => {},
});

export default AppContext;
