import { useState } from "react";
import "../styles/CoupActionButton.css";

export default function CoupExchangeButton(props) {
  const {
    playerRolesText,
    playerRoles,
    newRolesText,
    newRoles,
    onClick,
    onClickArgs,
  } = props;

  const numRoles = playerRoles.length;
  let titleText;
  if (numRoles === 1) {
    titleText = "Choose One Role";
  } else if (numRoles === 2) {
    titleText = "Choose Two Roles";
  }

  const allRoles = playerRoles.concat(newRoles);
  let booleanSelected = [];
  for (let i = 0; i < allRoles.length; i++) {
    // if (i < numRoles) {
    //   booleanSelected.push(true);
    // } else {
    booleanSelected.push(false);
    // }
  }
  const [isSelected, setIsSelected] = useState(booleanSelected); // Indexes for selected roles

  const createRole = (index) => {
    let style;
    if (isSelected[index]) {
      style = {
        margin: 5,
        backgroundColor: "#14FFEC",
      };
    } else {
      style = {
        margin: 5,
        // backgroundColor: "#D4D4D4",
      };
    }

    return (
      <button
        onClick={() => {
          isSelected[index] = !isSelected[index];
          setIsSelected(isSelected);
        }}
        style={style}
        className={"exchangeRoleButton"}
      >
        {allRoles[index]}
      </button>
    );
  };

  const displayPlayerRoleButtons = () => {
    let buttonArray = [];
    for (let index = 0; index < numRoles; index++) {
      buttonArray.push(createRole(index));
    }
    return buttonArray;
  };

  const displayNewRoleButtons = () => {
    let buttonArray = [];
    for (let index = numRoles; index < allRoles.length; index++) {
      buttonArray.push(createRole(index));
    }
    return buttonArray;
  };

  return (
    <div>
      <button
        className={"selectButton"}
        style={{
          width: "100%",
          height: "100%",
          padding: 10,
          backgroundColor: "#c4c4c4",
        }}
        onClick={() => {
          // Button itself does nothing
          return;
        }}
      >
        <div style={{ display: "block" }}>{titleText}</div>
        <div style={{ display: "block", marginTop: 10 }}>
          {playerRolesText + " "}
          {displayPlayerRoleButtons()}
        </div>
        <div style={{ display: "block", marginTop: 10 }}>
          {newRolesText + " "}
          {displayNewRoleButtons()}
        </div>

        <button
          style={{ marginTop: 10 }}
          onClick={() => {
            let selectedRoles = [];
            for (let i = 0; i < allRoles.length; i++) {
              if (isSelected[i]) {
                selectedRoles.push({
                  role: allRoles[i],
                  isNew: i >= numRoles,
                });
              }
            }
            // Only do something if exactly numRoles are sent
            if (selectedRoles.length !== numRoles) {
              if (numRoles === 1) {
                alert(`Please select exactly 1 role`);
              } else {
                alert(`Please select exactly ${numRoles} roles`);
              }
            } else {
              return onClick(onClickArgs.concat(selectedRoles)); // exchange with selected roles
            }
          }}
        >
          Submit
        </button>
      </button>
    </div>
  );
}
