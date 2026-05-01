function UserStatCard({ title, value, icon, iconClassName = "", onClick }) {
  return (
    <div
      className={onClick ? "user-stat-card clickable" : "user-stat-card"}
      onClick={onClick}
    >
      <div className={`user-stat-icon ${iconClassName}`}>{icon}</div>

      <div className="user-stat-content">
        <p>{title}</p>
        {value && <h3>{value}</h3>}
      </div>
    </div>
  );
}

export default UserStatCard;