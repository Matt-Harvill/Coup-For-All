import { useContext, useState } from "react";
import { socket } from "../../socket";
import SplendorGameContext from "./SplendorGameContext";

export default function SplendorSubmitButton(props) {
  const { turn } = useContext(SplendorGameContext);
  const { canSubmit, title } = props;

  const submitAction = () => {
    socket.emit("splendor", "submitAction", turn.action);
  };

  return (
    <button style={{ padding: 10 }} onClick={submitAction}>
      {title}
    </button>
  );
}
