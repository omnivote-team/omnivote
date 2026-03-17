function FeatureCard({ title, description, icon: Icon }) {
  return (
    <div className="feature-card">
      {Icon && (
        <div className="feature-icon">
          <Icon size={36} />
        </div>
      )}

      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default FeatureCard;