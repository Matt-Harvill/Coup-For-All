import { useContext, useEffect, useState } from "react";
import { longTurnTime, shortTurnTime } from "../coupTurnTimes";
import { socket } from "../socket";
import AppContext from "./AppContext";
import CoupActionButton from "./CoupActionButton";
import CoupExchangeButton from "./CoupExchangeButton";
import CoupGameContext from "./CoupGameContext";
import TimeLeft from "./TimeLeft";

export default function CoupActionbar() {
  const { turn, game } = useContext(CoupGameContext);
  const { userObj } = useContext(AppContext);
  const [maxTimeRem, setMaxTimeRem] = useState(longTurnTime);
  const timeRem = turn.timeRemMS;

  useEffect(() => {
    if (turn.stage) {
      switch (turn.stage) {
        case "blockAction":
        case "challengeRole":
        case "loseSwapRoles":
          setMaxTimeRem(shortTurnTime);
          break;
        case "selectAction":
        case "completeAction":
          setMaxTimeRem(longTurnTime);
          break;
        default:
          alert(`${turn.stage} is not a valid turn stage`);
      }
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

  const getStealablePlayers = () => {
    if (game.players) {
      return game.players.filter((player) => {
        const [pStat] = game.pStats.filter((pStat) => pStat.player === player);
        return player !== userObj.username && pStat.coins > 0;
      });
    } else {
      return null;
    }
  };

  const action = (args) => {
    socket.emit("coup", ...args);
  };

  const displayButtons = () => {
    let pStat;
    if (game.pStats) {
      pStat = game.pStats.find((pStat) => {
        return pStat.player === userObj.username;
      });
    }
    const otherPlayers = getOtherPlayers();
    const roleNames = ["Ambassador", "Assassin", "Captain", "Contessa", "Duke"];

    const assassinateButtonInfo = {
      title: "Assassinate",
      targets: otherPlayers,
      onClick: action,
      onClickArgs: ["assassinate", "target"],
    };

    const coupButtonInfo = {
      title: "Coup ",
      secondText: "For ",
      targets: otherPlayers,
      roles: roleNames,
      onClick: action,
      onClickArgs: ["coup", "target", "role"],
    };

    const challengeButtonInfos = [
      {
        title: "Pass",
        onClick: action,
        onClickArgs: ["noChallengeRole"],
      },
    ];

    // Exchange Button Info
    let exchangeButtonInfo;
    if (turn.exchangeRoles && pStat) {
      const numRoles = pStat.roles.length;

      const playerRolesText = numRoles === 1 ? "Your role" : "Your roles";

      exchangeButtonInfo = {
        exchangeButton: true,
        playerRolesText: playerRolesText,
        playerRoles: pStat.roles,
        newRolesText: "New roles",
        newRoles: turn.exchangeRoles,
        onClick: action,
        onClickArgs: ["exchangeRoles"],
      };
    }

    let buttonInfos = [];

    switch (turn.stage) {
      case "selectAction":
        // If  selectAction period, check if active player is this user
        if (turn.player === userObj.username && pStat) {
          const stealablePlayers = getStealablePlayers();
          const regularButtonInfos = [
            {
              title: "Income",
              onClick: action,
              onClickArgs: ["income"],
            },
            {
              title: "Foreign Aid",
              onClick: action,
              onClickArgs: ["foreignAid"],
            },
            {
              title: "Tax",
              onClick: action,
              onClickArgs: ["tax"],
            },
            {
              title: "Exchange",
              onClick: action,
              onClickArgs: ["exchange"],
            },
          ];

          // If player can steal, add that button
          if (stealablePlayers && stealablePlayers.length > 0) {
            const stealButtonInfo = {
              title: "Steal (up to 2 coins) From",
              targets: stealablePlayers,
              onClick: action,
              onClickArgs: ["steal", "target"],
            };
            regularButtonInfos.push(stealButtonInfo);
          }

          if (pStat.coins >= 3) {
            regularButtonInfos.push(assassinateButtonInfo);
          }
          if (pStat.coins < 10) {
            buttonInfos = regularButtonInfos;
          }
          if (pStat.coins >= 7) {
            buttonInfos.push(coupButtonInfo);
          }
        } else {
          return;
        }
        break;
      case "challengeRole":
        if (!turn.challenging.includes(userObj.username)) {
          return;
        } else {
          if (turn.target) {
            let title, role;
            switch (turn.target.action) {
              case "blockForeignAid":
              case "tax":
                role = "Duke";
                break;
              case "exchange":
                role = "Ambassador";
                break;
              case "steal":
                role = "Captain";
                break;
              case "assassinate":
                role = "Assassin";
                break;
              case "blockSteal":
                role = turn.target.blockingRole;
                break;
              case "blockAssassinate":
                role = "Contessa";
                break;
              default:
                alert("Not valid turn target action");
            }
            title = `Challenge ${turn.target.target}'s ${role}`;

            const challengeButtonInfo = {
              title: title,
              onClick: action,
              onClickArgs: ["challengeRole", turn.target.target],
            };

            // Add new buttonInfo to challengeButtonInfos
            challengeButtonInfos.push(challengeButtonInfo);
            buttonInfos = challengeButtonInfos;
          }
        }
        break;
      case "loseSwapRoles":
        // If the player has roles, check them to see if they need to chose a role to lose (and displayLoseButtons is true)
        if (pStat && pStat.roles && turn.displayLoseButtons) {
          const loseSwap = turn.loseSwap;
          const playerRoles = pStat.roles;
          if (loseSwap.losing && loseSwap.losing.player === userObj.username) {
            // Losing Role Button Infos
            let losingRoleButtonInfos = [];
            if (pStat) {
              for (const role of pStat.roles) {
                losingRoleButtonInfos.push({
                  title: `Lose ${role}`,
                  onClick: action,
                  onClickArgs: ["loseRole", role],
                });
              }
            }
            // If the same role, don't automatically lose anymore, but just show one button
            if (playerRoles.length === 2 && playerRoles[0] === playerRoles[1]) {
              buttonInfos.push(losingRoleButtonInfos[0]);
            } else {
              buttonInfos = losingRoleButtonInfos;
            }
          }
        }
        break;
      case "completeAction":
        if (turn.player === userObj.username && exchangeButtonInfo) {
          buttonInfos = [exchangeButtonInfo];
        }
        break;
      case "blockAction":
        if (!turn.challenging.includes(userObj.username)) {
          return;
        } else {
          console.log(`${turn.challenging} in blockAction buttonStuff`);
          let actionTitle, title, roles;
          let onClickArgs = ["blockAction", turn.action];

          if (turn.attacking && turn.attacking === userObj.username) {
            if (turn.action === "assassinate") {
              actionTitle = "assassination";
            } else if (turn.action === "steal") {
              title = `Block ${turn.player}'s steal with:`;
              roles = ["Ambassador", "Captain"];
              onClickArgs = ["blockAction", "steal", "role"];
            }
          } else if (turn.action === "foreignAid") {
            actionTitle = "foreign aid";
          }
          if (!title) {
            title = `Block ${turn.player}'s ${actionTitle}`;
          }

          const blockButtonInfo = {
            title: title,
            roles: roles,
            onClick: action,
            onClickArgs: onClickArgs,
          };

          // Add new buttonInfo to challengeButtonInfos
          challengeButtonInfos.push(blockButtonInfo);
          buttonInfos = challengeButtonInfos;
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
    if (buttonInfo.exchangeButton) {
      return (
        <CoupExchangeButton
          playerRolesText={buttonInfo.playerRolesText}
          playerRoles={buttonInfo.playerRoles}
          newRolesText={buttonInfo.newRolesText}
          newRoles={buttonInfo.newRoles}
          onClick={buttonInfo.onClick}
          onClickArgs={buttonInfo.onClickArgs}
        />
      );
    } else {
      return (
        <CoupActionButton
          title={buttonInfo.title}
          secondText={buttonInfo.secondText}
          targets={buttonInfo.targets}
          roles={buttonInfo.roles}
          onClick={buttonInfo.onClick}
          onClickArgs={buttonInfo.onClickArgs}
        />
      );
    }
  };

  const displayUnavailRoles = () => {
    const unavailRoles = game.unavailRoles;

    let roleHasBeenLost = false;
    if (unavailRoles) {
      // Key is the role name, value is the number of them
      for (const [key, value] of Object.entries(unavailRoles)) {
        if (value > 0) {
          roleHasBeenLost = true;
          break;
        }
      }
    }

    if (roleHasBeenLost) {
      let unavailRoleStrings = [];

      // Key is the role name, value is the number of them
      for (const [key, value] of Object.entries(unavailRoles)) {
        if (value === 1) {
          unavailRoleStrings.push(key);
        } else if (value > 1) {
          unavailRoleStrings.push(`${key} (${value})`);
        }
      }

      return (
        <div
          style={{ backgroundColor: "white", padding: 10, textAlign: "center" }}
        >
          <h5>Roles Out of Play</h5>
          <p>{unavailRoleStrings.join(", ")}</p>
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
      case "selectAction":
        if (turn.player === userObj.username) {
          textToDisplay = "Select your action";
        } else {
          textToDisplay = `${turn.player} is selecting their action...`;
        }
        break;
      case "completeAction":
        if (turn.player === userObj.username) {
          if (turn.exchangeRoles) {
            textToDisplay = "Exchange roles";
          } else {
            textToDisplay = "Completing your action...";
          }
        } else {
          textToDisplay = `${turn.player} is completing their ${turn.action}...`;
        }
        break;
      case "blockAction":
        if (
          !turn.challenging ||
          (turn.challenging && turn.challenging.length === 0)
        ) {
          textToDisplay = `Finishing up Blocking...`;
        } else {
          if (turn.challenging.includes(userObj.username)) {
            textToDisplay = `Pass or Block`;
          } else {
            const challenging = turn.challenging.join(", ");
            textToDisplay = `Waiting for ${challenging} to Pass or Block...`;
          }
        }
        break;
      case "challengeRole":
        if (
          !turn.challenging ||
          (turn.challenging && turn.challenging.length === 0)
        ) {
          textToDisplay = `Finishing up Challenging...`;
        } else {
          if (turn.challenging.includes(userObj.username)) {
            textToDisplay = `Pass or Challenge`;
          } else {
            const challenging = turn.challenging.join(", ");
            textToDisplay = `Waiting for ${challenging} to Pass or Challenge...`;
          }
        }
        break;
      case "loseSwapRoles":
        const loseSwap = turn.loseSwap;
        if (loseSwap.losing && loseSwap.losing.player === userObj.username) {
          textToDisplay = "Lose a Role";
        } else if (
          loseSwap.swapping &&
          loseSwap.swapping.player === userObj.username
        ) {
          textToDisplay = "Switching a Role";
        } else {
          if (loseSwap.losing && loseSwap.swapping) {
            textToDisplay = `Waiting for ${loseSwap.losing.player} to Lose their Role and ${loseSwap.swapping.player} to Switch their Role`;
          } else if (loseSwap.losing) {
            textToDisplay = `Waiting for ${loseSwap.losing.player} to Lose their Role`;
          } else if (loseSwap.swapping) {
            textToDisplay = `Waiting for ${loseSwap.swapping.player} to Switch their Role`;
          } else {
            textToDisplay = "Finishing up Role Losing/Switching...";
          }
        }
        break;
      default:
        break;
    }

    return <h4 style={{ textAlign: "center" }}>{textToDisplay}</h4>;
  };

  const displayIsSpectator = () => {
    if (game && game.outPlayers && game.outPlayers.includes(userObj.username)) {
      return (
        <div
          style={{ backgroundColor: "white", padding: 10, textAlign: "center" }}
        >
          <h5>You Are Spectating</h5>
        </div>
      );
    }
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
          backgroundColor: "#c4c4c4",
          padding: 10,
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
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
        {displayIsSpectator()}
      </div>
    );
  }
}
