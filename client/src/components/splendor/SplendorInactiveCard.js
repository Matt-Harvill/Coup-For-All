import { useContext } from "react";
import { socket } from "../../socket";
import { canSelectCard, cardSelected } from "../../splendorLogic/selectCard";
import AppContext from "../AppContext";
import SplendorGameContext from "./SplendorGameContext";

export default function SplendorInactiveCard(props) {
  const { turn } = useContext(SplendorGameContext);
  const { userObj } = useContext(AppContext);
  const level = props.level;

  if (!props.cardsRemaining) {
    return <div style={{ height: props.maxHeight }}></div>;
  }

  const displayLevelBubbles = () => {
    let bubbles = [];
    for (let i = 0; i < level; i++) {
      bubbles.push(
        <div
          style={{
            height: 15,
            width: 15,
            borderRadius: 15,
            backgroundColor: "white",
            border: `1px solid #464646`,
          }}
        ></div>
      );
    }

    return bubbles;
  };

  const cardStyle = {
    backgroundColor: "#9A86A4",
    boxSizing: "border-box",
    border: `1px solid #464646`,
    padding: 10,
    color: "#EAEAEA",
    display: "flex",
    flexDirection: "column",
    height: props.maxHeight,
  };

  if (turn.selectedCardID === `level${level}`) {
    cardStyle.boxShadow = "0px 0px 0px 4px #000000";
  }

  return (
    <div
      style={cardStyle}
      onClick={() => {
        return cardSelected(
          turn.selectedCardID === level,
          `level${level}`,
          "inactiveCard",
          turn.player,
          userObj.username,
          canSelectCard("inactiveCard", turn.action)
        );
      }}
    >
      <div style={{ flex: 1 }}></div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {displayLevelBubbles()}
      </div>
    </div>
  );
}
