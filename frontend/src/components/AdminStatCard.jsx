function AdminStatCard({ title, value }) {
  return (
    <div className="admin-stat-card">

      <div className="admin-stat-icon">
      </div>

      <div className="admin-stat-content">

        <p>{title}</p>

        <h3>{value}</h3>

      </div>

    </div>
  );
}


export default AdminStatCard;