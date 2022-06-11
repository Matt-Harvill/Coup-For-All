import { socket } from "../../socket";

export default function SplendorCancelButton() {
  const cancelAction = () => {
    socket.emit("splendor", "cancelAction");
  };

  return (
    <button style={{ padding: 10 }} onClick={cancelAction}>
      Cancel
    </button>
  );
}
