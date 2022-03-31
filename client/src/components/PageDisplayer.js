import { useContext } from "react";
import AppContext from "./AppContext";
import Coup from "../pages/Coup";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Splendor from "../pages/Splendor";

const PageDisplayer = () => {
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
        return <Coup />;
      case "splendor":
        return <Splendor />;
      default:
        return <h1>Error with page selection</h1>;
    }
  };

  return <div>{displayPage()}</div>;
};

export default PageDisplayer;
