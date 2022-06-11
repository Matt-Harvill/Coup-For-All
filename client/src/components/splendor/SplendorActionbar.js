import { useContext, useEffect, useState } from "react";
import { longTurnTime, shortTurnTime } from "../../coupTurnTimes";
import AppContext from "../AppContext";
import TimeLeft from "../TimeLeft";
import SplendorGameContext from "./SplendorGameContext";
import SplendorActionButton from "./SplendorActionButton";
import SplendorSubmitButton from "./SplendorSubmitButton";
import SplendorCancelButton from "./SplendorCancelButton";

export default function SplendorActionbar() {
  const { turn, game } = useContext(SplendorGameContext);
  const { userObj } = useContext(AppContext);
  const [maxTimeRem, setMaxTimeRem] = useState(longTurnTime);
  const timeRem = turn.timeRemMS;

  useEffect(() => {
    if (turn.stage) {
      if (turn.stage === "selectNoble") {
        setMaxTimeRem(shortTurnTime);
      } else if (turn.stage === "selectAction") {
        setMaxTimeRem(longTurnTime);
      } else {
        alert(`${turn.stage} is not a valid turn stage`);
      }
    }
  }, [turn.stage]);

  //   action: takeCoins, reserveCard, buyCard, selectNoble, null
  const displayTitle = () => {
    const thisPlayersTurn = userObj.username === turn.player;

    let actionTitle;
    switch (turn.action) {
      case "takeCoins":
        if (thisPlayersTurn) {
          actionTitle = "Select coins to take";
        } else {
          actionTitle = `Wait for ${turn.player} to take coins`;
        }
        break;
      case "reserveCard":
        if (thisPlayersTurn) {
          actionTitle = "Reserve a card";
        } else {
          actionTitle = `Wait for ${turn.player} to reserve a card`;
        }
        break;
      case "buyCard":
        if (thisPlayersTurn) {
          actionTitle = "Buy a card";
        } else {
          actionTitle = `Wait for ${turn.player} to buy a card`;
        }
        break;
      case "selectNoble":
        if (thisPlayersTurn) {
          actionTitle = "Select a noble";
        } else {
          actionTitle = `Wait for ${turn.player} to take a noble`;
        }
        break;
      case null:
        if (thisPlayersTurn) {
          actionTitle = "Choose an action";
        } else {
          actionTitle = `Wait for ${turn.player} to choose an action`;
        }
        break;
      default:
        break;
    }

    return <h4 style={{ textAlign: "center" }}>{actionTitle}</h4>;
  };

  const displayButtons = () => {
    const thisPlayersTurn = userObj.username === turn.player;

    let buttons = [];
    let submitButtonTitle;

    if (thisPlayersTurn) {
      if (turn.action) {
        // can be takeCoins, reserveCard, buyCard, selectNoble, null
        switch (turn.action) {
          case "takeCoins":
            submitButtonTitle = "Take selected coins";
            break;
          case "reserveCard":
            submitButtonTitle = "Reserve selected card";
            break;
          case "buyCard":
            submitButtonTitle = "Buy selected card";
            break;
          case "selectNoble":
            submitButtonTitle = "Take selected noble";
            break;
          default:
            break;
        }
        buttons.push(
          <SplendorSubmitButton canSubmit={true} title={submitButtonTitle} />
        );
        if (turn.stage === "selectAction") {
          buttons.push(<SplendorCancelButton />);
        }
      } else {
        if (turn.stage === "selectAction") {
          buttons.push(
            <SplendorActionButton title={"Take coins"} action={"takeCoins"} />
          );
          buttons.push(
            <SplendorActionButton
              title={"Reserve a card"}
              action={"reserveCard"}
            />
          );
          buttons.push(
            <SplendorActionButton title={"Buy a card"} action={"buyCard"} />
          );
        }
      }
    }

    return (
      <div
        style={{
          display: "grid",
          gridGap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
        }}
      >
        {buttons}
      </div>
    );
  };

  if (game.winner) {
    let name;
    if (userObj.username === game.winner) {
      name = "You";
    } else {
      name = game.winner;
    }

    return (
      <div
        style={{
          minHeight: 100,

          width: "100%",
          backgroundColor: "#464646",
          padding: 10,
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
          borderRadius: 0,
        }}
      >
        <div></div>
        <h4 style={{ textAlign: "center" }}>{`${name} Won!`}</h4>
      </div>
    );
  } else {
    return (
      <div
        style={{
          minHeight: 100,
          width: "100%",
          backgroundColor: "#464646",
          padding: 10,
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
          borderRadius: 0,
        }}
      >
        <div></div>
        <div>
          {displayTitle()}
          {displayButtons()}
          <div style={{ height: 10 }}></div>
          <TimeLeft timeLeft={timeRem} maxTimeLeft={maxTimeRem} />
        </div>
      </div>
    );
  }
}
