import { useContext } from "react";
import { allowedPage } from "../pageNavigator";
import AppContext from "./AppContext";

export default function PageSelector() {
  const { page, setPage, auth } = useContext(AppContext);

  const selectPage = (e) => {
    setPage(allowedPage(auth, page, e.target.value));
  };

  return (
    <div>
      <p style={{ display: "inline", marginRight: 6 }}>Select Page:</p>
      <select onChange={selectPage} value={page}>
        <option value="login">login</option>
        <option value="register">register</option>
        <option value="home">home</option>
        <option value="coup">coup</option>
        <option value="splendor">splendor</option>
      </select>
    </div>
  );
}
