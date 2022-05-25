export default function TimeLeft(props) {
  const { timeLeft, maxTimeLeft } = props;

  const displayTimeLeft = () => {
    if (timeLeft !== undefined && timeLeft !== null) {
      let modTimeLeft;
      if (timeLeft <= 0) {
        modTimeLeft = 0;
      } else {
        modTimeLeft = timeLeft;
      }

      let timeLeftColor = "#14FFEC";
      // if (modTimeLeft <= maxTimeLeft * 0.2) {
      //   timeLeftColor = "red";
      // } else if (modTimeLeft <= maxTimeLeft * 0.4) {
      //   timeLeftColor = "yellow";
      // } else if (modTimeLeft <= maxTimeLeft) {
      //   timeLeftColor = "green";
      // }

      return (
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={modTimeLeft.toString()}
            aria-valuemin="0"
            aria-valuemax={maxTimeLeft.toString()}
            style={{
              width: `${(1 - modTimeLeft / maxTimeLeft) * 100}%`,
              backgroundColor: timeLeftColor,
            }}
          ></div>
        </div>
      );
    }
  };

  return displayTimeLeft();
}
