function EmptyState() {
  return (
    <div className="no-elections-state">
      <div className="no-elections-icon">🔎</div>
      <h3>No elections found</h3>
      <p>Try changing your search, organization, or category filters.</p>
    </div>
  );
}

export default EmptyState;