import { useContext } from "react";
import AppContext from "./AppContext";

export default function PageSelector() {
  const { page, setPage } = useContext(AppContext);

  const selectPage = (e) => {
    setPage(e.target.value);
  };

  return (
    <div>
      <p>Select Page</p>
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
