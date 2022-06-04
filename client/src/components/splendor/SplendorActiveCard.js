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
      color = "#EAEAEA";
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
        border: `1px solid #464646`,
        padding: 10,
        color: "#464646",
        display: "flex",
        flexDirection: "column",
        height: props.maxHeight,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {card.points > 0 && (
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
        )}
        {card.points <= 0 && (
          // eslint-disable-next-line jsx-a11y/heading-has-content
          <h4
            style={{
              height: 30,
              width: 30,
            }}
          ></h4>
        )}
      </div>
      <div style={{ flex: 1 }}></div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap-reverse",
          width: 40,
        }}
      >
        {requirementsArr}
      </div>
    </div>
  );
}
