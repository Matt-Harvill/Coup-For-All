import { useContext } from "react";
import AppContext from "../components/AppContext";
import "../styles/styles.css";
import coupImage from "../images/coup.jpg";
import splendorImage from "../images/splendor.jpg";

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
    // {
    //   title: "Splendor",
    //   image: splendorImage,
    //   description:
    //     "Splendor is a game of chip-collecting and card development. Players are merchants of the Renaissance trying to buy gem mines, means of transportation, shops—all in order to acquire the most prestige points. If you're wealthy enough, you might even receive a visit from a noble at some point, which of course will further increase your prestige.",
    //   page: "splendor",
    // },
  ];

  const gameCardClicked = (newPage) => {
    setNewPage(newPage);
  };

  const mouseOverGameCard = (e) => {
    e.currentTarget.style.color = "white";
    // e.currentTarget.querySelector("img").style.transform = "scale(1.275)";
  };

  const mouseOutGameCard = (e) => {
    e.currentTarget.style.color = "#14FFEC";
    // e.currentTarget.querySelector("img").style.transform = "scale(1.0)";
  };

  const makeGameCard = (gameInfo) => {
    return (
      <div
        style={{
          borderRadius: 10,
          padding: 20,
          width: 260,
          minHeight: 150,
          backgroundColor: "#464646",
          // color: "#14FFEC",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
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
            // border: "1px solid darkgrey",
          }}
          alt={gameInfo.title}
          src={gameInfo.image}
        ></img>
        <h4 style={{ paddingTop: 10, color: "white" }}>{gameInfo.title}</h4>
        <p>{gameInfo.description}</p>
        <div style={{ flex: 1 }}></div>
        <button
          onClick={() => {
            gameCardClicked(gameInfo.page);
          }}
          style={{ marginTop: 10 }}
        >
          Go to {gameInfo.title} Lobby
        </button>
      </div>
    );
  };
  return (
    <div className="page gamesPage">
      <h1 style={{ textAlign: "center", paddingTop: 20 }}>Games</h1>
      <div
        style={{
          padding: 20,
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          justifyItems: "center",
        }}
      >
        {gameInfos.map(makeGameCard)}
      </div>
    </div>
  );
}
