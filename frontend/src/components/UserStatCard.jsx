function UserStatCard({ title, value, icon, iconClassName = "" }) {
  return (
    <div className="user-stat-card">
      <div className={`user-stat-icon ${iconClassName}`}>
        {icon}
      </div>

      <div className="user-stat-content">
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}

export default UserStatCard;