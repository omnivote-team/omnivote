function AdminActionCard({ title, description, onClick }) {
  return (
    <div className="admin-action-card" onClick={onClick}>
      <div className="admin-action-icon">
      </div>

      <div>
        <h3>{title}</h3>

        <p>{description}</p>
      </div>
    </div>
  );
}


export default AdminActionCard;