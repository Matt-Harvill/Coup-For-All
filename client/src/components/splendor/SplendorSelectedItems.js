import { useContext } from "react";
import AppContext from "../AppContext";
import { SplendorCoin } from "./SplendorCoin";
import SplendorGameContext from "./SplendorGameContext";

export default function SplendorSelectedItems() {
  const { userObj } = useContext(AppContext);
  const { turn, game } = useContext(SplendorGameContext);
  let activePlayer;
  if (game.players && game.players.length > 0) {
    activePlayer = game.players[0];
  }

  const coins = turn.selectedCoins;
  // const coins = game.coins;

  let coinDivs = [];
  if (coins) {
    for (const [key, value] of Object.entries(coins)) {
      if (value > 0) {
        coinDivs.push(
          <SplendorCoin
            coinSize={30}
            color={key}
            count={value}
            selectOnClick={false}
          />
        );
      }
    }
  }

  const style = {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  };

  if (activePlayer) {
    if (userObj.username === activePlayer) {
      return (
        <div style={style}>
          <h4 style={{ textAlign: "center" }}>Selected Coins</h4>
          <div
            style={{
              backgroundColor: "#f4deff",
              display: "grid",
              padding: 5,
              gap: 5,
              gridTemplateColumns: "repeat(auto-fill, minmax(30px,1fr))",
              minHeight: 80,
            }}
          >
            {coinDivs}
          </div>
        </div>
      );
    }
  }
}
