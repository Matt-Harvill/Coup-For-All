export default function TimeLeft(props) {
  const { timeLeft, maxTimeLeft } = props;

  const displayTimeLeft = () => {
    if (timeLeft) {
      let timeLeftColor;
      if (timeLeft <= maxTimeLeft * 0.2) {
        timeLeftColor = "red";
      } else if (timeLeft <= maxTimeLeft * 0.4) {
        timeLeftColor = "orange";
      } else if (timeLeft <= maxTimeLeft) {
        timeLeftColor = "green";
      }

      return (
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={timeLeft.toString()}
            aria-valuemin="0"
            aria-valuemax={maxTimeLeft.toString()}
            style={{
              width: `${(1 - timeLeft / maxTimeLeft) * 100}%`,
              backgroundColor: timeLeftColor,
            }}
          ></div>
        </div>
      );
    }
  };

  return displayTimeLeft();
}
