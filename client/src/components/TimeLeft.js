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
      const progressBarMargin = 1;

      const progressOuterDiv = document.getElementById("progressOuterDiv");
      // If the progressOuterDiv exists, set the width accordingly
      const progressBarWidth = progressOuterDiv
        ? progressOuterDiv.clientWidth
        : 0;

      const startingWidth = 14;

      let progressWidth =
        startingWidth +
        (1 - modTimeLeft / maxTimeLeft) * (progressBarWidth - startingWidth);

      if (progressWidth > progressBarWidth - progressBarMargin * 2) {
        progressWidth = progressBarWidth - progressBarMargin * 2;
      }

      return (
        <div
          id="progressOuterDiv"
          className="progress"
          style={{
            borderRadius: 10,
            width: "100%",
          }}
        >
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={modTimeLeft.toString()}
            aria-valuemin="0"
            aria-valuemax={maxTimeLeft.toString()}
            style={{
              width: progressWidth,
              backgroundColor: timeLeftColor,
              borderRadius: 10,
              margin: progressBarMargin,
            }}
          ></div>
        </div>
      );
    }
  };

  return displayTimeLeft();
}
