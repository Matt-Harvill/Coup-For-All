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

      const timeLeftColor = "#0D7377";
      const windowWidth = window.innerWidth;
      let timeBarStart;
      if (windowWidth > 1000) {
        timeBarStart = 3;
      } else if (windowWidth > 600) {
        timeBarStart = 5;
      } else {
        timeBarStart = 7;
      }

      let progressWidth;
      const progress = (1 - modTimeLeft / maxTimeLeft) * 100;
      if (progress < timeBarStart) {
        progressWidth = timeBarStart;
      } else {
        progressWidth = progress;
      }

      return (
        <div
          className="progress"
          style={{
            borderRadius: 10,
          }}
        >
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={modTimeLeft.toString()}
            aria-valuemin="0"
            aria-valuemax={maxTimeLeft.toString()}
            style={{
              width: `${progressWidth}%`,
              backgroundColor: timeLeftColor,
              borderRadius: 10,
              margin: 1,
            }}
          ></div>
        </div>
      );
    }
  };

  return displayTimeLeft();
}
