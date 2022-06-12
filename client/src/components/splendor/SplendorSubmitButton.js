import { socket } from "../../socket";

export default function SplendorSubmitButton(props) {
  const { canSubmit, title } = props;

  const submitAction = () => {
    socket.emit("splendor", "submitAction");
  };

  if (canSubmit) {
    return (
      <button style={{ padding: 10 }} onClick={submitAction}>
        {title}
      </button>
    );
  } else {
    return;
  }
}
