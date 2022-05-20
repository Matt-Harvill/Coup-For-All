import { useState } from "react";
import "../styles/CoupActionButton.css";

export default function CoupActionButton(props) {
  const { title, secondText, targets, roles, onClick, onClickArgs } = props;
  let initialTarget = "";
  let initialRole = "";
  if (targets) {
    initialTarget = targets[0];
  }
  if (roles) {
    initialRole = roles[0];
  }
  const [target, setTarget] = useState(initialTarget);
  const [targetedRole, setTargetedRole] = useState(initialRole);

  const selectTarget = (e) => {
    setTarget(e.target.value);
  };

  const selectTargetedRole = (e) => {
    setTargetedRole(e.target.value);
  };

  const createOption = (selectionArg) => {
    return <option value={selectionArg}>{selectionArg}</option>;
  };

  return (
    <div>
      <button
        className={(targets || roles) && "selectButton"}
        style={{ width: "100%", height: "100%", padding: 10 }}
        onClick={() => {
          // If there are selection args then the button itself won't do anything
          if (targets || roles) {
            return;
          }

          if (onClick) {
            return onClick(onClickArgs);
          }
        }}
      >
        {title}
        {/* If selectionArgs then create select items */}
        {targets && (
          <select
            style={{ maxWidth: "100%" }}
            onChange={selectTarget}
            value={target}
          >
            {targets.map(createOption)}
          </select>
        )}
        {roles && (
          <div>
            <div>{secondText}</div>
            <select
              style={{ maxWidth: "100%" }}
              onChange={selectTargetedRole}
              value={targetedRole}
            >
              {roles.map(createOption)}
            </select>
          </div>
        )}
        {(targets || roles) && (
          <button
            style={{ marginTop: 10 }}
            onClick={() => {
              // Replace select0/select1 with actual select args
              let args = [];
              if (onClickArgs) {
                for (let arg of onClickArgs) {
                  if (arg === "target") {
                    arg = target;
                  } else if (arg === "role") {
                    arg = targetedRole;
                  }
                  args.push(arg);
                }
              } else {
                args = onClickArgs;
              }
              return onClick(args);
            }}
          >
            Submit
          </button>
        )}
      </button>
    </div>
  );
}
