import { useContext } from "react";
import AppContext from "./AppContext";
import CoupLobby from "../pages/CoupLobby";
import Games from "../pages/Games";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SplendorLobby from "../pages/SplendorLobby";
import CoupGame from "../pages/CoupGame";

export default function PageDisplayer() {
  const { page } = useContext(AppContext);

  const displayPage = () => {
    switch (page) {
      case "login":
        return <Login />;
      case "register":
        return <Register />;
      case "games":
        return <Games />;
      case "coup":
        return <CoupLobby />;
      case "coupGame":
        return <CoupGame />;
      case "splendor":
        return <SplendorLobby />;
      default:
        return <h1>Error with page selection</h1>;
    }
  };

  return displayPage();
}
