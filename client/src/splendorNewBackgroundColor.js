export default function splendorNewBackgroundColor(color) {
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
    case "yellow":
      backgroundColor = "#fff880";
      break;
    default:
      backgroundColor = "purple";
      break;
  }
  return backgroundColor;
}
