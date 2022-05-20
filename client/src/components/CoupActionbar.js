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
  //   actionSuccess: null,
  //   timeRemMS: String,
  //   interval: (),
  //   stage: String, // Turn can be preCallout, callout, postCallout
  //   targets: [
  //     {
  //       target: String,
  //       action: String,
  //       attacking: String
  //     },
  //   ],
  //   roleSwitch: {
  //     losing: {
  //        player: null,
  //        role: null
  //     },
  //     switching: {
  //        player: null,
  //        role: null
  //     }
  //   }
  //   deciding: [],
  // },

  const { turn, game } = useContext(CoupGameContext);
  const { userObj } = useContext(AppContext);
  const [maxTimeRem, setMaxTimeRem] = useState(30000);
  const timeRem = turn.timeRemMS;

  useEffect(() => {
    switch (turn.stage) {
      case "callout":
      case "roleSwitch":
        setMaxTimeRem(15000);
        break;
      case "preCallout":
      case "postCallout":
        setMaxTimeRem(30000);
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

    // If there are targets, allow user to call them out
    if (turn.targets && turn.targets.length > 0) {
      // Loop through targets to make Call out buttons for each target (or block depending on action)
      for (const turnTarget of turn.targets) {
        let title;

        switch (turnTarget.action) {
          case "foreignAid": // Foreign Aid is blocked by Duke, so it is also calling out a Duke
          case "tax":
            title = `Call Out ${turnTarget.target}'s 'Duke'`;
            break;
          default:
            break;
        }

        const calloutButtonInfo = {
          title: title,
          selectionArgs: null,
          onClick: action,
          onClickArgs: ["callout", turnTarget.target],
        };

        // Add new buttonInfo to calloutButtonInfos
        calloutButtonInfos.push(calloutButtonInfo);
      }
    } else {
      // If the action if foreignAid but no turnTargets, display block capability
      if (turn.action === "foreignAid") {
        const calloutButtonInfo = {
          title: `Block ${turn.player}'s Foreign Aid`,
          selectionArgs: null,
          onClick: action,
          onClickArgs: ["block", "foreignAid"],
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

    let losingRoleButtonInfos = [];
    if (game.pStats) {
      const pStat = game.pStats.find((pStat) => {
        return pStat.player === userObj.username;
      });
      if (pStat) {
        for (const role of pStat.roles) {
          losingRoleButtonInfos.push({
            title: `Lose ${role}`,
            selectionArgs: null,
            onClick: action,
            onClickArgs: ["loseRole", role],
          });
        }
      }
    }

    let buttonInfos;

    switch (turn.stage) {
      case "callout":
        // Don't display callout buttons if user has decided (or is being accused)
        if (!turn.deciding.includes(userObj.username)) {
          return;
        }
        // If user is not being called out, let them call out or pass
        else {
          buttonInfos = calloutButtonInfos;
        }
        break;
      case "roleSwitch":
        // Get the player's pStat
        const pStat = game.pStats.find(
          (pStat) => pStat.player === userObj.username
        );
        // If the player has roles, check them to see if they need to chose a role to lose
        if (pStat && pStat.roles) {
          const roleSwitch = turn.roleSwitch;
          const playerRoles = pStat.roles;
          if (
            roleSwitch.losing &&
            roleSwitch.losing.player === userObj.username &&
            roleSwitch.losing.numRoles < playerRoles.length &&
            playerRoles.length === 2 &&
            playerRoles[0] !== playerRoles[1]
          ) {
            buttonInfos = losingRoleButtonInfos;
          }
        }

        break;
      case "preCallout":
      case "postCallout":
        // If not pre/postCallout period, check if active player is this user
        if (turn.player === userObj.username) {
          buttonInfos = regularButtonInfos;
        } else {
          return;
        }
        break;
      default:
        break;
    }

    return (
      <div
        style={{
          display: "grid",
          gridGap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
        }}
      >
        {buttonInfos && buttonInfos.map(makeButton)}
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

  const displayUnavailRoles = () => {
    const unavailRoles = game.unavailRoles;
    if (unavailRoles && unavailRoles.length > 0) {
      return (
        <div style={{ backgroundColor: "white", padding: 10 }}>
          <h5>Roles Out of Play</h5>
          <p>{unavailRoles.join(", ")}</p>
        </div>
      );
    } else {
      // Return empty div to take the grid space
      return <div></div>;
    }
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
      case "roleSwitch":
        const roleSwitch = turn.roleSwitch;
        if (
          roleSwitch.losing &&
          roleSwitch.losing.player === userObj.username
        ) {
          textToDisplay = "Losing a Role";
        } else if (
          roleSwitch.switching &&
          roleSwitch.switching.player === userObj.username
        ) {
          textToDisplay = "Switching a Role";
        } else {
          textToDisplay = "Waiting for Others to Lose/Switch Roles...";
        }
        break;
      default:
        break;
    }

    return <h4 style={{ textAlign: "center" }}>{textToDisplay}</h4>;
  };

  if (game.winner) {
    return (
      <div
        style={{
          minHeight: 100,
          width: "100%",
          backgroundColor: "#c4c4c4",
          padding: 10,
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
        }}
      >
        <div></div>
        <h4 style={{ textAlign: "center" }}>{`${game.winner} Won!`}</h4>;
      </div>
    );
  } else {
    return (
      <div
        style={{
          minHeight: 100,
          width: "100%",
          backgroundColor: "#c4c4c4",
          padding: 10,
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
        }}
      >
        {displayUnavailRoles()}
        <div style={{ marginLeft: 20, marginRight: 20 }}>
          {displayTurnTitle()}
          <div style={{ height: 10 }}></div>
          {displayButtons()}
          <div style={{ height: 10 }}></div>
          {turn !== {} && (
            <TimeLeft timeLeft={timeRem} maxTimeLeft={maxTimeRem} />
          )}
        </div>
      </div>
    );
  }
}
