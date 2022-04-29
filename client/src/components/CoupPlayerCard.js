export default function CoupPlayerCard(props) {
  const pStat = props.pStat;

  return (
    <div style={{ minHeight: 100, width: 200, backgroundColor: "#c4c4c4" }}>
      <p>
        <strong>{pStat.player}</strong>
      </p>
      <p>Coins: {pStat.coins}</p>
      <p>Roles: {pStat.roles.join(", ")}</p>
    </div>
  );
}
