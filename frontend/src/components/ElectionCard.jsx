function ElectionCard({ election, title, organization, status, dates }) {
  const cardTitle = election?.title || title;
  const cardOrganization = election?.organization || organization;
  const cardStatus = election?.status || status;
  const cardDates = election?.dates || dates;

  return (
    <div className="election-card">
      <span className="status-badge">{cardStatus}</span>

      <h3>{cardTitle}</h3>
      <p className="election-organization">{cardOrganization}</p>
      <p className="election-dates">{cardDates}</p>

      <button className="details-button">View Details</button>
    </div>
  );
}

export default ElectionCard;