export default function SplendorInactiveCard(props) {
  const level = props.level;

  const displayLevelBubbles = () => {
    let bubbles = [];
    for (let i = 0; i < level; i++) {
      bubbles.push(
        <div
          style={{
            height: 15,
            width: 15,
            borderRadius: 15,
            backgroundColor: "white",
            border: `1px solid #464646`,
          }}
        ></div>
      );
    }

    return bubbles;
  };

  return (
    <div
      style={{
        backgroundColor: "#9A86A4",
        border: `1px solid #464646`,
        padding: 10,
        color: "#EAEAEA",
        display: "flex",
        flexDirection: "column",
        height: props.maxHeight,
      }}
    >
      <div style={{ flex: 1 }}></div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {displayLevelBubbles()}
      </div>
    </div>
  );
}
