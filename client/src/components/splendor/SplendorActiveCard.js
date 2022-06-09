import { useContext } from "react";
import { socket } from "../../socket";
import splendorNewBackgroundColor from "../../splendorNewBackgroundColor";
import AppContext from "../AppContext";
import SplendorGameContext from "./SplendorGameContext";

export default function SplendorActiveCard(props) {
  const { turn } = useContext(SplendorGameContext);
  const { userObj } = useContext(AppContext);
  const card = props.card;

  let requirementsArr = [];
  for (const [key, value] of Object.entries(card.requirements)) {
    let color;
    if (key === "black") {
      color = "#EAEAEA";
    } else {
      color = "#464646";
    }

    if (value > 0) {
      requirementsArr.push(
        <div
          style={{
            display: "flex",
            backgroundColor: splendorNewBackgroundColor(key),
            color: color,
            height: 20,
            width: 20,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            border: `1px solid ${color}`,
          }}
        >
          {value}
        </div>
      );
    }
  }

  const cardClicked = () => {
    if (turn.player === userObj.username) {
      // If card isn't already selected
      if (turn.selectedCardID !== card._id) {
        socket.emit("splendor", "selectCard", card._id);
      }
    }
  };

  const cardStyle = {
    backgroundColor: splendorNewBackgroundColor(card.resource.color),
    boxSizing: "border-box",
    border: `1px solid #464646`,
    padding: 10,
    color: "#464646",
    display: "flex",
    flexDirection: "column",
    height: props.maxHeight,
  };

  if (turn.selectedCardID === card._id) {
    cardStyle.boxShadow = "0px 0px 0px 4px #000000";
  }

  return (
    <div style={cardStyle} onClick={cardClicked}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {card.points > 0 && (
          <h4
            style={{
              display: "flex",
              backgroundColor: "#EAEAEA",
              border: "1px solid #464646",
              height: 30,
              width: 30,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {card.points}
          </h4>
        )}
        {card.points <= 0 && (
          // eslint-disable-next-line jsx-a11y/heading-has-content
          <h4
            style={{
              height: 30,
              width: 30,
            }}
          ></h4>
        )}
      </div>
      <div style={{ flex: 1 }}></div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap-reverse",
          width: 40,
        }}
      >
        {requirementsArr}
      </div>
    </div>
  );
}
