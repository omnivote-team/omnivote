function ElectionCard({ election, title, organization, status, dates, onViewDetails }) {
  const cardTitle = election?.title || title;

  const cardOrganization =
    election?.institution_name ||
    election?.organization ||
    organization ||
    `Institution ID: ${election?.institution_id}`;

  const cardStatus = election?.status || status;

  const formatDate = (dateValue) => {
  if (!dateValue) return "";

  return new Date(dateValue).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const cardDates =
  election?.dates ||
  dates ||
  `${formatDate(election?.start_datetime)} - ${formatDate(election?.end_datetime)}`;

  return (
    <div className="election-card">
      <span className="status-badge">{cardStatus}</span>

      <h3>{cardTitle}</h3>
      <p className="election-organization">{cardOrganization}</p>
      <p className="election-dates">{cardDates}</p>

      <button className="details-button" onClick={onViewDetails}>
        View Details
      </button>
    </div>
  );
}

export default ElectionCard;