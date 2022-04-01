import { createContext } from "react";

// set the defaults
const AppContext = createContext({
  auth: "",
  setAuth: () => {},
  page: "",
  setPage: () => {},
  newPage: "",
  setNewPage: () => {},
  chats: [],
  setChats: () => {},
  user: "",
  setUser: () => {},
});

export default AppContext;
