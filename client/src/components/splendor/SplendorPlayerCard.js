import { useContext } from "react";
import splendorNewBackgroundColor from "../../splendorNewBackgroundColor";
import SplendorGameContext from "./SplendorGameContext";

export default function SplendorPlayerCard(props) {
  const { game } = useContext(SplendorGameContext);
  let activePlayer;
  if (game.players.length > 0) {
    activePlayer = game.players[0];
  }
  const pStat = props.pStat;

  const displayCoins = () => {
    const coins = pStat.coins;
    const coinSize = 30;

    let coinDivs = [];
    for (const [key, value] of Object.entries(coins)) {
      if (value > 0) {
        let color;
        if (key === "black") {
          color = "#EAEAEA";
        } else {
          color = "#464646";
        }
        coinDivs.push(
          <div
            style={{
              display: "flex",
              backgroundColor: splendorNewBackgroundColor(key),
              color: color,
              height: coinSize,
              width: coinSize,
              borderRadius: coinSize,
              justifyContent: "center",
              alignItems: "center",
              border: `1px solid ${color}`,
              fontSize: coinSize / 2,
            }}
          >
            {value}
          </div>
        );
      } else if (pStat.permanentResources[key] > 0) {
        coinDivs.push(
          <div
            style={{
              height: coinSize,
              width: coinSize,
            }}
          ></div>
        );
      }
    }

    return coinDivs;
  };

  const displayPermanentResources = () => {
    const permanentResources = pStat.permanentResources;
    const cardHeight = 42;
    const cardWidth = 30;

    let permanentResourceDivs = [];
    for (const [key, value] of Object.entries(permanentResources)) {
      if (value > 0) {
        let color;
        if (key === "black") {
          color = "#EAEAEA";
        } else {
          color = "#464646";
        }
        permanentResourceDivs.push(
          <div
            style={{
              display: "flex",
              backgroundColor: splendorNewBackgroundColor(key),
              color: color,
              height: cardHeight,
              width: cardWidth,
              borderRadius: 6,
              justifyContent: "center",
              alignItems: "center",
              border: `1px solid ${color}`,
              fontSize: cardWidth / 2,
            }}
          >
            {value}
          </div>
        );
      } else if (pStat.coins[key] > 0) {
        permanentResourceDivs.push(
          <div
            style={{
              height: cardHeight,
              width: cardWidth,
            }}
          ></div>
        );
      }
    }

    return permanentResourceDivs;
  };

  const style = {
    backgroundColor: "#464646",
    padding: 10,
    display: "flex",
    flexDirection: "column",
    minHeight: 140,
  };

  if (pStat.player === activePlayer) {
    style.boxShadow = "0px 0px 20px #14FFEC";
  }

  return (
    <div style={style}>
      <div style={{ display: "flex" }}>
        <h4>{pStat.player}</h4>
        <div style={{ flex: 1 }}></div>
        <h4
          style={{
            display: "flex",
            backgroundColor: "#EAEAEA",
            color: "#464646",
            border: "1px solid #464646",
            height: 30,
            minWidth: 30,
            paddingLeft: 5,
            paddingRight: 5,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {pStat.points}
        </h4>
      </div>
      <div
        style={{
          flex: 1,
          backgroundColor: "#f4deff",
          padding: 10,
          color: "#464646",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 5,
            gridTemplateColumns: "repeat(auto-fill, minmax(30px,1fr))",
            maxWidth: 215,
          }}
        >
          {displayPermanentResources()}
        </div>
        <div style={{ height: 10 }}></div>
        <div
          style={{
            display: "grid",
            gap: 5,
            gridTemplateColumns: "repeat(auto-fill, minmax(30px,1fr))",
            maxWidth: 215,
          }}
        >
          {displayCoins()}
        </div>
      </div>
    </div>
  );
}
