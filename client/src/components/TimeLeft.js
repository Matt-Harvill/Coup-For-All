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

      // With actionBar padding of 10 left and right
      const actionBarPaddingLeft = 10;
      const actionBarPaddingRight = 10;
      // With buttonBlock margins 20 each side
      const buttonsMarginLeft = 20;
      const buttonsMarginRight = 20;

      const progressBarWidth =
        (window.innerWidth - actionBarPaddingLeft - actionBarPaddingRight) / 2 -
        buttonsMarginLeft -
        buttonsMarginRight;

      const startingWidth = 14;

      const progressWidth =
        startingWidth +
        (1 - modTimeLeft / maxTimeLeft) * (progressBarWidth - startingWidth);

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
              width: progressWidth,
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
