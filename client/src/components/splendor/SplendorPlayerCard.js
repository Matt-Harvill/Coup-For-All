import { useContext } from "react";
import SplendorGameContext from "./SplendorGameContext";

export default function SplendorPlayerCard(props) {
  const { game } = useContext(SplendorGameContext);
  let activePlayer;
  if (game.players.length > 0) {
    activePlayer = game.players[0];
  }
  const pStat = props.pStat;
  const width = props.width;

  const style = {
    minHeight: 100,
    width: width,
    backgroundColor: "#464646",
    padding: 10,
  };

  if (pStat.player === activePlayer) {
    style.boxShadow = "0px 0px 20px #14FFEC";
  }

  return (
    <div style={style}>
      <h4>
        {/* <strong> */}
        {pStat.player}
        {/* </strong> */}
      </h4>
      <p>Points: {pStat.points}</p>
      <div>
        <p>Permanent Resources: {JSON.stringify(pStat.permanentResources)}</p>
      </div>
      <div>
        <p>Coins: {JSON.stringify(pStat.coins)}</p>
      </div>
    </div>
  );
}
