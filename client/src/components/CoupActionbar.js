import { useContext, useEffect, useState } from "react";
import { socket } from "../socket";
import AppContext from "./AppContext";
import CoupActionButton from "./CoupActionButton";
import CoupGameContext from "./CoupGameContext";
import TimeLeft from "./TimeLeft";

export default function CoupActionbar() {
  // turn: {
  //   player: String,
  //   action: String,
  //   timeRemMS: String,
  //   interval: (),
  //   stage: String, // Turn can be preCallout, callout, postCallout
  //   targets: [
  //     {
  //       target: String,
  //       action: String,
  //     },
  //   ],
  //   caller: {
  //     caller:
  //     target:
  //   }
  //   deciding: [],
  // },

  const { turn, game } = useContext(CoupGameContext);
  const { userObj } = useContext(AppContext);
  const [maxTimeRem, setMaxTimeRem] = useState(10000);
  const timeRem = turn.timeRemMS;

  useEffect(() => {
    switch (turn.stage) {
      case "callout":
      case "losingRoles":
        setMaxTimeRem(5000);
        break;
      case "preCallout":
      case "postCallout":
        setMaxTimeRem(10000);
        break;
      default:
        break;
    }
  }, [turn.stage]);

  const getOtherPlayers = () => {
    if (game.players) {
      return game.players.filter((player) => {
        return player !== userObj.username;
      });
    } else {
      return null;
    }
  };

  const action = (args) => {
    socket.emit("coup", ...args);
  };

  const displayButtons = () => {
    const otherPlayers = getOtherPlayers();

    const calloutButtonInfos = [
      {
        title: "Pass",
        selectionArgs: null,
        onClick: action,
        onClickArgs: ["noCallout"],
      },
    ];

    if (turn.targets) {
      // Loop through targets to make Call out buttons for each target (or block depending on action)
      for (const turnTarget of turn.targets) {
        let title, onClickArgs;

        switch (turnTarget.action) {
          case "foreignAid":
            title = `Block ${turnTarget.target}'s Foreign Aid`;
            onClickArgs = ["block"];
            break;
          case "tax":
            title = `Call Out ${turnTarget.target}'s 'Duke'`;
            onClickArgs = ["callout", turnTarget.target];
            break;
          default:
            break;
        }

        const calloutButtonInfo = {
          title: title,
          selectionArgs: null,
          onClick: action,
          onClickArgs: onClickArgs,
        };

        // Add new buttonInfo to calloutButtonInfos
        calloutButtonInfos.push(calloutButtonInfo);
      }
    }

    const regularButtonInfos = [
      {
        title: "Income",
        selectionArgs: null,
        onClick: action,
        onClickArgs: ["income"],
      },
      {
        title: "Foreign Aid",
        selectionArgs: null,
        onClick: action,
        onClickArgs: ["foreignAid"],
      },
      {
        title: "Tax",
        selectionArgs: null,
        onClick: action,
        onClickArgs: ["tax"],
      },
      // {
      //   title: "Assassinate~",
      //   selectionArgs: otherPlayers,
      //   onClick: null,
      //   onClickArgs: null,
      // },
      // {
      //   title: "Exchange~",
      //   selectionArgs: null,
      //   onClick: null,
      //   onClickArgs: null,
      // },
      // {
      //   title: "Steal~",
      //   selectionArgs: otherPlayers,
      //   onClick: null,
      //   onClickArgs: null,
      // },
      // {
      //   title: "Coup~",
      //   selectionArgs: otherPlayers,
      //   onClick: null,
      //   onClickArgs: null,
      // },
    ];

    let buttonInfos;

    if (turn.stage === "callout") {
      // Don't display callout buttons if user has decided (or is being accused)
      if (!turn.deciding.includes(userObj.username)) {
        return;
      }
      // If user is not being called out, let them call out or pass
      else {
        buttonInfos = calloutButtonInfos;
      }
    }
    // If not callout period, check if active player is this user
    else if (turn.player === userObj.username) {
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

  const displayTurnTitle = () => {
    let textToDisplay;

    switch (turn.stage) {
      case "preCallout":
      case "postCallout":
        if (turn.player === userObj.username) {
          textToDisplay = "Make Your Move";
        } else {
          textToDisplay = `${turn.player} is Making their Move...`;
        }
        break;
      case "callout":
        if (turn.deciding.includes(userObj.username)) {
          textToDisplay = "Pass or Callout";
        } else {
          textToDisplay = "Waiting for Others to Callout...";
        }
        break;
      case "losingRoles":
        // If player is
        // if (turn.targets.includes(userObj.username)) {
        textToDisplay = "Losing Roles Stage";
        // }
        break;
      default:
        break;
    }

    return <h4 style={{ textAlign: "center" }}>{textToDisplay}</h4>;
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
        {turn !== {} && (
          <TimeLeft timeLeft={timeRem} maxTimeLeft={maxTimeRem} />
        )}
        <div style={{ height: 10 }}></div>
        {displayButtons()}
      </div>
    </div>
  );
}
