import { useContext, useState } from "react";
import { socket } from "../../socket";
import SplendorGameContext from "./SplendorGameContext";

export default function SplendorSubmitButton(props) {
  const { turn } = useContext(SplendorGameContext);
  const { canSubmit, title } = props;

  const submitAction = () => {
    socket.emit("splendor", "submitAction", turn.action);
  };

  const style = {
    padding: 10,
  };

  // let className = "";
  // if (!canSubmit) {
  //   style.opacity = 0.65;
  //   className = "disabledButton";
  // } else {
  //   style.opacity = 1;
  // }

  if (canSubmit) {
    return (
      <button
        // className={className}
        style={style}
        onClick={submitAction}
      >
        {title}
      </button>
    );
  } else {
    return;
  }
}
