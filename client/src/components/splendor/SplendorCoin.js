import { useContext } from "react";
import { socket } from "../../socket";
import splendorNewBackgroundColor from "../../splendorNewBackgroundColor";
import AppContext from "../AppContext";
import SplendorGameContext from "./SplendorGameContext";

export const SplendorCoin = (props) => {
  const { turn } = useContext(SplendorGameContext);
  const { userObj } = useContext(AppContext);
  const { coinSize, color, count, selectOnClick } = props;

  const canSelectCoin = () => {
    if (turn.action === "takeCoins" && selectOnClick && color !== "yellow") {
      let totalCoinsSelected = 0;
      let doubleSelected, colorSelected;
      for (const [clr, cnt] of Object.entries(turn.selectedCoins)) {
        totalCoinsSelected += cnt;
        if (cnt === 2) {
          doubleSelected = true;
        }
        if (color === clr && cnt > 0) {
          colorSelected = true;
        }
      }
      if (totalCoinsSelected < 3 && !doubleSelected) {
        if (colorSelected) {
          if (totalCoinsSelected <= 1 && turn.coins[color] > 2) {
            return true;
          }
        } else {
          if (turn.coins[color] > 0) {
            return true;
          }
        }
      }
    }
    return false;
  };

  let textAndBorderColor;
  if (color === "black") {
    textAndBorderColor = "#EAEAEA";
  } else {
    textAndBorderColor = "#464646";
  }

  const coinStyle = {
    display: "flex",
    backgroundColor: splendorNewBackgroundColor(color),
    color: textAndBorderColor,
    height: coinSize,
    width: coinSize,
    borderRadius: coinSize,
    justifyContent: "center",
    alignItems: "center",
    border: `1px solid ${textAndBorderColor}`,
    fontSize: coinSize / 2,
  };

  if (canSelectCoin() && turn.player === userObj.username) {
    coinStyle.boxShadow = "0px 0px 0px 4px #00ff00";
  }

  const canClick = canSelectCoin() || !selectOnClick;

  if (canClick) {
    coinStyle.cursor = "pointer";
  }

  return (
    <div
      style={coinStyle}
      onClick={() => {
        if (!selectOnClick) {
          socket.emit("splendor", "unselectCoin", color);
        } else if (canSelectCoin()) {
          socket.emit("splendor", "selectCoin", color);
        }
      }}
    >
      {count}
    </div>
  );
};
