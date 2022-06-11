import { socket } from "../../socket";

export default function SplendorActionButton(props) {
  const { title, action } = props;

  const submitSelectAction = () => {
    socket.emit("splendor", "selectAction", action);
  };

  return (
    <button style={{ padding: 10 }} onClick={submitSelectAction}>
      {title}
    </button>
  );
}
