export default function CoupPlayerCard(props) {
  const pStat = props.pStat;
  const width = props.width;

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
    </div>
  );
}
