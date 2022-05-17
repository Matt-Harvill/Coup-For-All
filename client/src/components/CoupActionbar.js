import { useContext, useEffect, useState } from "react";
import { socket } from "../socket";
import AppContext from "./AppContext";
import CoupActionButton from "./CoupActionButton";
import CoupGameContext from "./CoupGameContext";
import TimeLeft from "./TimeLeft";

export default function CoupActionbar() {
  const { turnInfo, game } = useContext(CoupGameContext);
  const { userObj } = useContext(AppContext);
  const [maxTimeLeft, setMaxTimeLeft] = useState(60);
  const timeLeft = turnInfo.timeLeft;

  useEffect(() => {
    if (turnInfo.inCalloutPeriod) {
      setMaxTimeLeft(30);
    } else {
      setMaxTimeLeft(60);
    }
  }, [turnInfo]);

  const getOtherPlayers = () => {
    if (game.players) {
      return game.players.filter((player) => {
        return player !== userObj.username;
      });
    } else {
      return null;
    }
  };

  const displayButtons = () => {
    const otherPlayers = getOtherPlayers();

    const calloutButtonInfos = [
      { title: "Pass~", selectionArgs: null, onClick: null, onClickArgs: null },
      {
        title: "Call Out~",
        selectionArgs: null,
        onClick: null,
        onClickArgs: null,
      },
    ];

    const regularButtonInfos = [
      {
        title: "Income~",
        selectionArgs: null,
        onClick: income,
        onClickArgs: null,
      },
      {
        title: "Foreign Aid~",
        selectionArgs: null,
        onClick: null,
        onClickArgs: null,
      },
      { title: "Tax~", selectionArgs: null, onClick: null, onClickArgs: null },
      {
        title: "Assassinate~",
        selectionArgs: otherPlayers,
        onClick: null,
        onClickArgs: null,
      },
      {
        title: "Exchange~",
        selectionArgs: null,
        onClick: null,
        onClickArgs: null,
      },
      {
        title: "Steal~",
        selectionArgs: otherPlayers,
        onClick: null,
        onClickArgs: null,
      },
      {
        title: "Coup~",
        selectionArgs: otherPlayers,
        onClick: null,
        onClickArgs: null,
      },
      {
        title: "Action~",
        selectionArgs: null,
        onClick: action,
        onClickArgs: ["testArg0", "testArg1"],
      },
      {
        title: "End Turn~",
        selectionArgs: null,
        onClick: endTurn,
        onClickArgs: null,
      },
    ];

    let buttonInfos;

    if (turnInfo.inCalloutPeriod) {
      // Don't display callout buttons if user is the one being tested
      if (turnInfo.activePlayer === userObj.username) {
        return;
      }
      // If user is not being called out, let them call out or pass
      else {
        buttonInfos = calloutButtonInfos;
      }
    }
    // If not callout period, check if active player is this user
    else if (turnInfo.activePlayer === userObj.username) {
      buttonInfos = regularButtonInfos;
    } else {
      return;
    }

    return (
      <div
        style={{
          display: "grid",
          gridGap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
        }}
      >
        {buttonInfos.map(makeButton)}
      </div>
    );
  };

  const makeButton = (buttonInfo) => {
    return (
      <CoupActionButton
        title={buttonInfo.title}
        selectionArgs={buttonInfo.selectionArgs}
        onClick={buttonInfo.onClick}
        onClickArgs={buttonInfo.onClickArgs}
      />
    );
  };

  const income = () => {
    socket.emit("coup", "income");
  };

  const endTurn = () => {
    socket.emit("coup", "endTurn");
  };

  const action = (...args) => {
    // console.log(args);
    socket.emit("coup", "action", "defaultAction", "defaultTarget");
  };

  const displayTurnTitle = () => {
    let nameToDisplay;
    if (turnInfo.activePlayer === userObj.username) {
      nameToDisplay = "Your";
    } else {
      nameToDisplay = `${turnInfo.activePlayer}'s`;
    }

    return <h4 style={{ textAlign: "center" }}>{`${nameToDisplay} turn`}</h4>;
  };

  return (
    <div
      style={{
        minHeight: 100,
        width: "100%",
        backgroundColor: "#c4c4c4",
        padding: 10,
      }}
    >
      <div style={{ margin: "auto", width: "50%" }}>
        {displayTurnTitle()}
        <TimeLeft timeLeft={timeLeft} maxTimeLeft={maxTimeLeft} />
        <div style={{ height: 10 }}></div>
        {displayButtons()}
      </div>
    </div>
  );
}
