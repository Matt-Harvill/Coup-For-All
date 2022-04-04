import { createContext } from "react";

// set the defaults
const AppContext = createContext({
  auth: "",
  setAuth: () => {},
  page: "",
  setPage: () => {},
  newPage: "",
  setNewPage: () => {},
  user: "",
  setUser: () => {},
});

export default AppContext;
