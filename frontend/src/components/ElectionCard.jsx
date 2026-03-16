function ElectionCard({ title, organization, status, dates }) {
  return (
    <div className="election-card">
      <span className="status-badge">{status}</span>

      <h3>{title}</h3>
      <p className="election-organization">{organization}</p>
      <p className="election-dates">{dates}</p>

      <button className="details-button">View Details</button>
    </div>
  );
}

export default ElectionCard;