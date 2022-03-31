import { createContext } from "react";

// set the defaults
const AppContext = createContext({
  auth: "default",
  setAuth: () => {},
  page: "default",
  setPage: () => {},
  chats: [],
  setChats: () => {},
  user: "default",
  setUser: () => {},
});

export default AppContext;
