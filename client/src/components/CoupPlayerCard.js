export default function CoupPlayerCard(props) {
  const pStat = props.pStat;
  const timeLeft = props.timeLeft;
  const width = props.width;

  const maxTimeLeft = 10;

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
        <div>
          <p>Turn Time Remaining:</p>
          <div class="progress">
            <div
              class="progress-bar"
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
        </div>
      );
    }
  };

  return (
    <div
      style={{
        minHeight: 100,
        width: width,
        backgroundColor: "#c4c4c4",
        padding: 10,
      }}
    >
      <p>
        <strong>{pStat.player}</strong>
      </p>
      <p>Coins: {pStat.coins}</p>
      <p>Roles: {pStat.roles.join(", ")}</p>
      {displayTimeLeft()}
    </div>
  );
}
