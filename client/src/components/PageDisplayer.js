import { useContext } from "react";
import AppContext from "./AppContext";
import CoupLobby from "../pages/CoupLobby";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Splendor from "../pages/Splendor";
import CoupGame from "../pages/CoupGame";

export default function PageDisplayer() {
  const { page } = useContext(AppContext);

  const displayPage = () => {
    switch (page) {
      case "login":
        return <Login />;
      case "register":
        return <Register />;
      case "home":
        return <Home />;
      case "coup":
        return <CoupLobby />;
      case "coupGame":
        return <CoupGame />;
      case "splendor":
        return <Splendor />;
      default:
        return <h1>Error with page selection</h1>;
    }
  };

  return displayPage();
}
