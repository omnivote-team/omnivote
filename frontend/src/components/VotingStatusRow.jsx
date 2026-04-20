function VotingStatusRow({ title, subtext, status, isLast }) {
  const badgeClassName = status.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`voting-status-row ${!isLast ? "with-border" : ""}`}>
      <div className="voting-status-text">
        <h3>{title}</h3>
        {subtext && <p>{subtext}</p>}
      </div>

      <span className={`voting-status-badge ${badgeClassName}`}>
        {status}
      </span>
    </div>
  );
}

export default VotingStatusRow;