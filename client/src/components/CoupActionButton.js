import { useState } from "react";

export default function CoupActionButton(props) {
  const { title, selectionArgs, onClick, onClickArgs } = props;
  const [target, setTarget] = useState("");

  const selectTarget = (e) => {
    setTarget(e.target.value);
  };

  const createOption = (selectionArg) => {
    return <option value={selectionArg}>{selectionArg}</option>;
  };

  return (
    <div>
      <button
        style={{ width: "100%", height: "100%" }}
        onClick={() => {
          if (onClick) {
            return onClick(onClickArgs);
          }
        }}
      >
        {title}
        {/* If selectionArgs then create select item */}
        {selectionArgs && (
          <select onChange={selectTarget} value={target}>
            {selectionArgs.map(createOption)}
          </select>
        )}
      </button>
    </div>
  );
}
