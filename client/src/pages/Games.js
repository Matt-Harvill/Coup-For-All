import { useContext } from "react";
import AppContext from "../components/AppContext";
import "../styles/styles.css";
import coupImage from "../images/coup.jpg";

export default function Games() {
  const { setNewPage } = useContext(AppContext);

  const gameInfos = [
    {
      title: "Coup",
      image: coupImage,
      description:
        "You are head of a family in an Italian city-state, a city run by a weak and corrupt court. You need to manipulate, bluff and bribe your way to power. Your object is to destroy the influence of all the other families, forcing them into exile. Only one family will survive...",
      page: "coup",
    },
  ];

  const gameCardClicked = (newPage) => {
    setNewPage(newPage);
  };

  const mouseOverGameCard = (e) => {
    e.currentTarget.style.background = "#d3d3d3";
    // e.currentTarget.querySelector("img").style.transform = "scale(1.275)";
  };

  const mouseOutGameCard = (e) => {
    e.currentTarget.style.background = "#c4c4c4";
    // e.currentTarget.querySelector("img").style.transform = "scale(1.0)";
  };

  const makeGameCard = (gameInfo) => {
    return (
      <div
        style={{
          padding: 20,
          width: 300,
          minHeight: 150,
          backgroundColor: "#c4c4c4",
          overflow: "hidden",
        }}
        // onMouseOver={mouseOverGameCard}
        // onMouseOut={mouseOutGameCard}
      >
        <img
          style={{
            display: "block",
            width: "100%",
            height: 150,
            objectFit: "cover",
            objectPosition: "center",
            border: "1px solid darkgrey",
          }}
          alt={gameInfo.title}
          src={gameInfo.image}
        ></img>
        <h4 style={{ paddingTop: 10 }}>{gameInfo.title}</h4>
        <p>{gameInfo.description}</p>
        <button
          onClick={() => {
            gameCardClicked(gameInfo.page);
          }}
        >
          Go to {gameInfo.title} Lobby
        </button>
      </div>
    );
  };
  return (
    <div className="page">
      <h1 style={{ textAlign: "center", paddingTop: 20 }}>Games</h1>
      <div
        style={{
          padding: 20,
          display: "grid",
          gridGap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          justifyItems: "center",
        }}
      >
        {gameInfos.map(makeGameCard)}
      </div>
    </div>
  );
}
