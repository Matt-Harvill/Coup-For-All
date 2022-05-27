export default function SplendorActiveCard(props) {
  const card = props.card;

  const getNewBackgroundColor = (color) => {
    let backgroundColor;
    switch (color) {
      case "green":
        backgroundColor = "#92BA92";
        break;
      case "blue":
        backgroundColor = "#94DAFF";
        break;
      case "red":
        backgroundColor = "#FF7878";
        break;
      case "black":
        backgroundColor = "black";
        break;
      case "white":
        backgroundColor = "white";
        break;
      default:
        backgroundColor = "yellow";
        break;
    }
    return backgroundColor;
  };

  let requirementsArr = [];
  for (const [key, value] of Object.entries(card.requirements)) {
    let color;
    if (key === "black") {
      color = "white";
    } else {
      color = "#464646";
    }

    if (value > 0) {
      requirementsArr.push(
        <div
          style={{
            display: "flex",
            backgroundColor: getNewBackgroundColor(key),
            color: color,
            height: 20,
            width: 20,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            border: `1px solid ${color}`,
          }}
        >
          {value}
        </div>
      );
    }
  }

  return (
    <div
      style={{
        backgroundColor: getNewBackgroundColor(card.resource.color),
        padding: 10,
        color: "#464646",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <h4
          style={{
            display: "flex",
            backgroundColor: "#EAEAEA",
            border: "1px solid #464646",
            height: 30,
            width: 30,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {card.points}
        </h4>
      </div>

      <div style={{ display: "flex" }}>{requirementsArr}</div>
    </div>
  );
}
